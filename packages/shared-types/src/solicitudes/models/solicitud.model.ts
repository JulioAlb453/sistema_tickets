import { CategoriaTicket, Prioridad, SagaPaso, SagaResultado } from '../../common';
import { SolicitudEstado } from '../enums';

/**
 * Agregado del orquestador — representa el flujo Saga completo.
 * Persistido en la BD del servicio coordinador-solicitudes.
 */
export interface Solicitud {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  categoria: CategoriaTicket;
  estado: SolicitudEstado;
  ticketId: string | null;
  tecnicoId: string | null;
  pasoActual: SagaPaso | null;
  resultadoSaga: SagaResultado | null;
  mensajeError: string | null;
  solicitanteId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Log de pasos ejecutados durante la Saga (auditoría / depuración).
 */
export interface SagaLog {
  id: string;
  solicitudId: string;
  paso: SagaPaso;
  exito: boolean;
  detalle: string | null;
  createdAt: Date;
}
