import { AsignacionEstado } from '../enums';

/**
 * Entidad de dominio — reserva de técnico vinculada a un ticket.
 */
export interface Asignacion {
  id: string;
  ticketId: string;
  solicitudId: string;
  tecnicoId: string;
  estado: AsignacionEstado;
  createdAt: Date;
  updatedAt: Date;
}
