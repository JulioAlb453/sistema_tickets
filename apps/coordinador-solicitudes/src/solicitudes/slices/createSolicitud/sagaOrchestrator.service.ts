import {
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EVENTO_SOLICITUD_COMPLETADA,
  CreateSolicitudDto,
  SagaPaso,
  SagaResultado,
  SolicitudEstado,
} from '@sistema-tickets/shared-types';
import { Repository } from 'typeorm';
import { isAxiosError } from 'axios';
import { SolicitudEntity } from '../../entities/solicitud.entity';
import { SagaLogEntity } from '../../entities/sagaLog.entity';
import {
  AsignacionClient,
  TicketsClient,
} from '../../infrastructure/http/downstreamClients';
import { RedisPublisher } from '../../infrastructure/redis/redisPublisher';
import { toSolicitudResponse } from '../../mappers/solicitud.mapper';

@Injectable()
export class SagaOrchestratorService {
  private readonly logger = new Logger(SagaOrchestratorService.name);

  constructor(
    @InjectRepository(SolicitudEntity)
    private readonly solicitudRepository: Repository<SolicitudEntity>,
    @InjectRepository(SagaLogEntity)
    private readonly sagaLogRepository: Repository<SagaLogEntity>,
    private readonly ticketsClient: TicketsClient,
    private readonly asignacionClient: AsignacionClient,
    private readonly redisPublisher: RedisPublisher,
  ) {}

  async execute(dto: CreateSolicitudDto, solicitanteId: string) {
    const solicitud = await this.solicitudRepository.save(
      this.solicitudRepository.create({
        ...dto,
        solicitanteId,
        estado: SolicitudEstado.enProceso,
        ticketId: null,
        tecnicoId: null,
        pasoActual: SagaPaso.crearTicket,
        resultadoSaga: null,
        mensajeError: null,
      }),
    );

    let ticketId: string | null = null;
    let tecnicoId: string | null = null;
    let tecnicoNombre: string | null = null;

    try {
      // Paso 1: crear ticket
      const ticket = await this.ticketsClient.createTicket({
        solicitudId: solicitud.id,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        prioridad: dto.prioridad,
        categoria: dto.categoria,
        solicitanteId,
      });
      ticketId = ticket.id;
      solicitud.ticketId = ticketId;
      solicitud.pasoActual = SagaPaso.asignarTecnico;
      await this.solicitudRepository.save(solicitud);
      await this.logStep(solicitud.id, SagaPaso.crearTicket, true, ticketId);

      // Paso 2: asignar técnico
      const asignacion = await this.asignacionClient.asignarTecnico({
        ticketId,
        solicitudId: solicitud.id,
        categoria: dto.categoria,
        prioridad: dto.prioridad,
      });
      tecnicoId = asignacion.tecnicoId;
      tecnicoNombre = asignacion.tecnicoNombre;
      solicitud.tecnicoId = tecnicoId;
      solicitud.pasoActual = SagaPaso.confirmarTicket;
      await this.solicitudRepository.save(solicitud);
      await this.logStep(
        solicitud.id,
        SagaPaso.asignarTecnico,
        true,
        tecnicoId,
      );

      // Paso 3: confirmar ticket
      await this.ticketsClient.confirmTicket(ticketId, { tecnicoId });
      await this.logStep(solicitud.id, SagaPaso.confirmarTicket, true);

      solicitud.estado = SolicitudEstado.completada;
      solicitud.resultadoSaga = SagaResultado.completada;
      solicitud.pasoActual = null;
      await this.solicitudRepository.save(solicitud);

      await this.redisPublisher.publishSolicitudCompletada({
        evento: EVENTO_SOLICITUD_COMPLETADA,
        solicitudId: solicitud.id,
        ticketId,
        tecnicoId,
        tecnicoNombre: tecnicoNombre ?? '',
        titulo: dto.titulo,
        prioridad: dto.prioridad,
        categoria: dto.categoria,
        solicitanteId,
        timestamp: new Date().toISOString(),
      });

      return toSolicitudResponse(solicitud, {
        tecnicoNombre,
        mensaje: 'Solicitud completada exitosamente',
      });
    } catch (error) {
      const message = this.extractErrorMessage(error);
      this.logger.error(`Saga fallida en solicitud ${solicitud.id}: ${message}`);

      await this.compensate(solicitud.id, ticketId, message);

      const status = isAxiosError(error)
        ? (error.response?.status ?? 502)
        : 500;

      throw new HttpException(
        {
          solicitudId: solicitud.id,
          mensaje: message,
          compensacionEjecutada: true,
        },
        status,
      );
    }
  }

  private async compensate(
    solicitudId: string,
    ticketId: string | null,
    errorMessage: string,
  ) {
    if (ticketId) {
      try {
        await this.asignacionClient.liberarAsignacion(ticketId);
        await this.logStep(
          solicitudId,
          SagaPaso.asignarTecnico,
          false,
          'Compensación: técnico liberado',
        );
      } catch (compError) {
        this.logger.error('Error al liberar técnico', compError);
      }

      try {
        await this.ticketsClient.cancelTicket(ticketId, {
          motivo: `Compensación Saga: ${errorMessage}`,
        });
        await this.logStep(
          solicitudId,
          SagaPaso.crearTicket,
          false,
          'Compensación: ticket cancelado',
        );
      } catch (compError) {
        this.logger.error('Error al cancelar ticket', compError);
      }
    }

    await this.solicitudRepository.update(solicitudId, {
      estado: SolicitudEstado.compensada,
      resultadoSaga: SagaResultado.compensada,
      mensajeError: errorMessage,
      pasoActual: null,
    });
  }

  private async logStep(
    solicitudId: string,
    paso: SagaPaso,
    exito: boolean,
    detalle?: string,
  ) {
    await this.sagaLogRepository.save(
      this.sagaLogRepository.create({ solicitudId, paso, exito, detalle: detalle ?? null }),
    );
  }

  private extractErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string | string[] };
      if (Array.isArray(data?.message)) {
        return data.message.join(', ');
      }
      return data?.message ?? error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Error desconocido en la Saga';
  }
}
