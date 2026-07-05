import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EVENTO_SOLICITUD_COMPLETADA,
  REDIS_CHANNEL_SOLICITUD_COMPLETADA,
  SolicitudCompletadaEvent,
} from '@sistema-tickets/shared-types';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { TicketEntity } from '../../entities/ticket.entity';
import { TicketEventoAuditoriaEntity } from '../../entities/ticketEventoAuditoria.entity';

@Injectable()
export class SolicitudCompletadaConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(SolicitudCompletadaConsumer.name);
  private subscriber!: Redis;

  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketEventoAuditoriaEntity)
    private readonly auditoriaRepository: Repository<TicketEventoAuditoriaEntity>,
  ) {}

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
    this.subscriber = new Redis(redisUrl);

    void this.subscriber.subscribe(REDIS_CHANNEL_SOLICITUD_COMPLETADA);
    this.subscriber.on('message', (channel, message) => {
      if (channel === REDIS_CHANNEL_SOLICITUD_COMPLETADA) {
        void this.handleMessage(message);
      }
    });

    this.logger.log(
      `Suscrito al canal Redis: ${REDIS_CHANNEL_SOLICITUD_COMPLETADA}`,
    );
  }

  async onModuleDestroy() {
    await this.subscriber?.quit();
  }

  private async handleMessage(rawMessage: string) {
    try {
      const event = JSON.parse(rawMessage) as SolicitudCompletadaEvent;
      if (event.evento !== EVENTO_SOLICITUD_COMPLETADA) {
        return;
      }

      const ticket = await this.ticketRepository.findOne({
        where: { id: event.ticketId },
      });

      if (ticket) {
        ticket.notificado = true;
        await this.ticketRepository.save(ticket);
      }

      await this.auditoriaRepository.save(
        this.auditoriaRepository.create({
          ticketId: event.ticketId,
          tipoEvento: event.evento,
          payload: event as unknown as Record<string, unknown>,
        }),
      );

      this.logger.log(
        `Evento procesado para ticket ${event.ticketId} — auditoría registrada`,
      );
    } catch (error) {
      this.logger.error('Error al procesar evento Redis', error);
    }
  }
}
