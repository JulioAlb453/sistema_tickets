import { CategoriaTicket, Prioridad } from '../common';

/** Canal Redis para solicitudes completadas exitosamente. */
export const REDIS_CHANNEL_SOLICITUD_COMPLETADA = 'solicitudes.completadas';

/** Tipo de evento publicado al finalizar la Saga con éxito. */
export const EVENTO_SOLICITUD_COMPLETADA = 'SolicitudCompletada';

export interface SolicitudCompletadaEvent {
  evento: typeof EVENTO_SOLICITUD_COMPLETADA;
  solicitudId: string;
  ticketId: string;
  tecnicoId: string;
  tecnicoNombre: string;
  titulo: string;
  prioridad: Prioridad;
  categoria: CategoriaTicket;
  solicitanteId: string;
  timestamp: string;
}

/** Evento consumido por gestion-tickets para marcar notificación/auditoría. */
export const EVENTO_TICKET_NOTIFICACION_PENDIENTE = 'TicketNotificacionPendiente';

export interface TicketNotificacionPendienteEvent {
  evento: typeof EVENTO_TICKET_NOTIFICACION_PENDIENTE;
  ticketId: string;
  solicitudId: string;
  timestamp: string;
}
