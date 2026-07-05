import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AsignacionEstado,
  LiberarAsignacionResponseDto,
  TecnicoEstado,
} from '@sistema-tickets/shared-types';
import { Repository } from 'typeorm';
import { AsignacionEntity } from '../../entities/asignacion.entity';
import { TecnicoEntity } from '../../entities/tecnico.entity';

@Injectable()
export class LiberarAsignacionService {
  constructor(
    @InjectRepository(AsignacionEntity)
    private readonly asignacionRepository: Repository<AsignacionEntity>,
    @InjectRepository(TecnicoEntity)
    private readonly tecnicoRepository: Repository<TecnicoEntity>,
  ) {}

  async execute(ticketId: string): Promise<LiberarAsignacionResponseDto> {
    const asignacion = await this.asignacionRepository.findOne({
      where: { ticketId },
    });

    if (!asignacion) {
      return {
        ticketId,
        liberado: true,
        mensaje: 'No existía asignación activa (idempotente)',
      };
    }

    if (asignacion.estado === AsignacionEstado.liberado) {
      return {
        ticketId,
        liberado: true,
        mensaje: 'Asignación ya estaba liberada',
      };
    }

    const tecnico = await this.tecnicoRepository.findOne({
      where: { id: asignacion.tecnicoId },
    });

    if (tecnico) {
      tecnico.cargaActual = Math.max(0, tecnico.cargaActual - 1);
      tecnico.estado = TecnicoEstado.disponible;
      await this.tecnicoRepository.save(tecnico);
    }

    asignacion.estado = AsignacionEstado.liberado;
    await this.asignacionRepository.save(asignacion);

    return {
      ticketId,
      liberado: true,
      mensaje: 'Técnico liberado correctamente',
    };
  }
}
