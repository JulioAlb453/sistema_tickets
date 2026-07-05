import { CategoriaTicket, Prioridad } from '../../common';
import { SolicitudEstado } from '../enums';

export class SolicitudResponseDto {
  solicitudId!: string;
  ticketId!: string | null;
  tecnicoId!: string | null;
  tecnicoNombre!: string | null;
  estado!: SolicitudEstado;
  titulo!: string;
  prioridad!: Prioridad;
  categoria!: CategoriaTicket;
  mensaje!: string;
  createdAt!: string;
}

export class EstadoSolicitudDto {
  solicitudId!: string;
  estado!: SolicitudEstado;
  ticketId!: string | null;
  tecnicoId!: string | null;
  pasoActual!: string | null;
  mensajeError!: string | null;
  updatedAt!: string;
}
