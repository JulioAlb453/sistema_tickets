import { CategoriaTicket, Prioridad } from '../../common';
import { TicketEstado } from '../enums';

export class TicketResponseDto {
  id!: string;
  solicitudId!: string;
  titulo!: string;
  descripcion!: string;
  prioridad!: Prioridad;
  categoria!: CategoriaTicket;
  estado!: TicketEstado;
  tecnicoId!: string | null;
  solicitanteId!: string | null;
  notificado!: boolean;
  createdAt!: string;
  updatedAt!: string;
}
