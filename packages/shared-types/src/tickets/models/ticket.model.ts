import { CategoriaTicket, Prioridad } from '../../common';
import { TicketEstado } from '../enums';

/**
 * Entidad de dominio — Gestión de tickets.
 * Persistida en la BD del servicio gestion-tickets.
 */
export interface Ticket {
  id: string;
  solicitudId: string;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  categoria: CategoriaTicket;
  estado: TicketEstado;
  tecnicoId: string | null;
  solicitanteId: string | null;
  notificado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Registro de auditoría generado al consumir eventos Redis.
 */
export interface TicketEventoAuditoria {
  id: string;
  ticketId: string;
  tipoEvento: string;
  payload: Record<string, unknown>;
  createdAt: Date;
}
