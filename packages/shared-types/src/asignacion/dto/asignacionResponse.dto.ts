import { AsignacionEstado } from '../enums';

export class AsignacionResponseDto {
  id!: string;
  ticketId!: string;
  solicitudId!: string;
  tecnicoId!: string;
  tecnicoNombre!: string;
  estado!: AsignacionEstado;
  createdAt!: string;
}

export class TecnicoResponseDto {
  id!: string;
  nombre!: string;
  email!: string;
  especialidades!: string[];
  estado!: string;
  cargaActual!: number;
}

export class LiberarAsignacionResponseDto {
  ticketId!: string;
  liberado!: boolean;
  mensaje!: string;
}
