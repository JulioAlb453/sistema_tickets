import {
  AsignacionResponseDto,
  TecnicoResponseDto,
} from '@sistema-tickets/shared-types';
import { AsignacionEntity } from '../entities/asignacion.entity';
import { TecnicoEntity } from '../entities/tecnico.entity';

export function toAsignacionResponse(
  asignacion: AsignacionEntity,
  tecnico: TecnicoEntity,
): AsignacionResponseDto {
  return {
    id: asignacion.id,
    ticketId: asignacion.ticketId,
    solicitudId: asignacion.solicitudId,
    tecnicoId: asignacion.tecnicoId,
    tecnicoNombre: tecnico.nombre,
    estado: asignacion.estado,
    createdAt: asignacion.createdAt.toISOString(),
  };
}

export function toTecnicoResponse(tecnico: TecnicoEntity): TecnicoResponseDto {
  return {
    id: tecnico.id,
    nombre: tecnico.nombre,
    email: tecnico.email,
    especialidades: tecnico.especialidades,
    estado: tecnico.estado,
    cargaActual: tecnico.cargaActual,
  };
}
