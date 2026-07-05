import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AsignacionEstado,
  AsignarTecnicoDto,
  TecnicoEstado,
} from '@sistema-tickets/shared-types';
import { Repository } from 'typeorm';
import { AsignacionEntity } from '../../entities/asignacion.entity';
import { TecnicoEntity } from '../../entities/tecnico.entity';
import { toAsignacionResponse } from '../../mappers/asignacion.mapper';

@Injectable()
export class AsignarTecnicoService {
  constructor(
    @InjectRepository(AsignacionEntity)
    private readonly asignacionRepository: Repository<AsignacionEntity>,
    @InjectRepository(TecnicoEntity)
    private readonly tecnicoRepository: Repository<TecnicoEntity>,
  ) {}

  async execute(dto: AsignarTecnicoDto) {
    const existing = await this.asignacionRepository.findOne({
      where: { ticketId: dto.ticketId },
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe una asignación para el ticket ${dto.ticketId}`,
      );
    }

    const tecnico = await this.findTecnicoDisponible(dto);
    if (!tecnico) {
      throw new NotFoundException(
        'No hay técnicos disponibles para la categoría solicitada',
      );
    }

    tecnico.estado = TecnicoEstado.ocupado;
    tecnico.cargaActual += 1;
    await this.tecnicoRepository.save(tecnico);

    const asignacion = this.asignacionRepository.create({
      ticketId: dto.ticketId,
      solicitudId: dto.solicitudId,
      tecnicoId: tecnico.id,
      estado: AsignacionEstado.reservado,
    });

    const saved = await this.asignacionRepository.save(asignacion);
    return toAsignacionResponse(saved, tecnico);
  }

  private async findTecnicoDisponible(dto: AsignarTecnicoDto) {
    if (dto.tecnicoIdPreferido) {
      const preferido = await this.tecnicoRepository.findOne({
        where: {
          id: dto.tecnicoIdPreferido,
          estado: TecnicoEstado.disponible,
        },
      });
      if (
        preferido?.especialidades.includes(dto.categoria)
      ) {
        return preferido;
      }
    }

    const tecnicos = await this.tecnicoRepository.find({
      where: { estado: TecnicoEstado.disponible },
      order: { cargaActual: 'ASC' },
    });

    return (
      tecnicos.find((t) => t.especialidades.includes(dto.categoria)) ?? null
    );
  }
}
