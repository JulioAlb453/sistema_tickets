import { TicketResponseDto } from '@sistema-tickets/shared-types';
import { TicketEntity } from '../entities/ticket.entity';

export function toTicketResponse(ticket: TicketEntity): TicketResponseDto {
  return {
    id: ticket.id,
    solicitudId: ticket.solicitudId,
    titulo: ticket.titulo,
    descripcion: ticket.descripcion,
    prioridad: ticket.prioridad,
    categoria: ticket.categoria,
    estado: ticket.estado,
    tecnicoId: ticket.tecnicoId,
    solicitanteId: ticket.solicitanteId,
    notificado: ticket.notificado,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}
