import {
  CategoriaTicket,
  Prioridad,
  SagaPaso,
  SagaResultado,
  SolicitudEstado,
} from '@sistema-tickets/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('solicitudes')
export class SolicitudEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'enum', enum: Prioridad })
  prioridad!: Prioridad;

  @Column({ type: 'enum', enum: CategoriaTicket })
  categoria!: CategoriaTicket;

  @Column({
    type: 'enum',
    enum: SolicitudEstado,
    default: SolicitudEstado.enProceso,
  })
  estado!: SolicitudEstado;

  @Column({ name: 'ticket_id', type: 'uuid', nullable: true })
  ticketId!: string | null;

  @Column({ name: 'tecnico_id', type: 'uuid', nullable: true })
  tecnicoId!: string | null;

  @Column({ name: 'paso_actual', type: 'enum', enum: SagaPaso, nullable: true })
  pasoActual!: SagaPaso | null;

  @Column({
    name: 'resultado_saga',
    type: 'enum',
    enum: SagaResultado,
    nullable: true,
  })
  resultadoSaga!: SagaResultado | null;

  @Column({ name: 'mensaje_error', type: 'text', nullable: true })
  mensajeError!: string | null;

  @Column({ name: 'solicitante_id', type: 'uuid' })
  solicitanteId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
