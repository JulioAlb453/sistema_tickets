import {
  EstadoSolicitudDto,
  SolicitudResponseDto,
} from '@sistema-tickets/shared-types';
import { SolicitudEntity } from '../entities/solicitud.entity';

export function toSolicitudResponse(
  solicitud: SolicitudEntity,
  extras?: { tecnicoNombre?: string | null; mensaje?: string },
): SolicitudResponseDto {
  return {
    solicitudId: solicitud.id,
    ticketId: solicitud.ticketId,
    tecnicoId: solicitud.tecnicoId,
    tecnicoNombre: extras?.tecnicoNombre ?? null,
    estado: solicitud.estado,
    titulo: solicitud.titulo,
    prioridad: solicitud.prioridad,
    categoria: solicitud.categoria,
    mensaje: extras?.mensaje ?? 'Solicitud procesada',
    createdAt: solicitud.createdAt.toISOString(),
  };
}

export function toEstadoSolicitud(solicitud: SolicitudEntity): EstadoSolicitudDto {
  return {
    solicitudId: solicitud.id,
    estado: solicitud.estado,
    ticketId: solicitud.ticketId,
    tecnicoId: solicitud.tecnicoId,
    pasoActual: solicitud.pasoActual,
    mensajeError: solicitud.mensajeError,
    updatedAt: solicitud.updatedAt.toISOString(),
  };
}
