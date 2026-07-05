import {
  CategoriaTicket,
  Prioridad,
  TicketEstado,
} from '@sistema-tickets/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'solicitud_id', type: 'uuid' })
  solicitudId!: string;

  @Column({ length: 100 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'enum', enum: Prioridad })
  prioridad!: Prioridad;

  @Column({ type: 'enum', enum: CategoriaTicket })
  categoria!: CategoriaTicket;

  @Column({ type: 'enum', enum: TicketEstado, default: TicketEstado.pendiente })
  estado!: TicketEstado;

  @Column({ name: 'tecnico_id', type: 'uuid', nullable: true })
  tecnicoId!: string | null;

  @Column({ name: 'solicitante_id', type: 'uuid', nullable: true })
  solicitanteId!: string | null;

  @Column({ default: false })
  notificado!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
