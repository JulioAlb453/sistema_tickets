import { CategoriaTicket } from '../../common';
import { TecnicoEstado } from '../enums';

/**
 * Entidad de dominio — catálogo de técnicos.
 * Persistida en la BD del servicio asignacion-tecnicos.
 */
export interface Tecnico {
  id: string;
  nombre: string;
  email: string;
  especialidades: CategoriaTicket[];
  estado: TecnicoEstado;
  cargaActual: number;
  createdAt: Date;
  updatedAt: Date;
}
