import { AsignacionEstado } from '@sistema-tickets/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('asignaciones')
export class AsignacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'ticket_id', type: 'uuid', unique: true })
  ticketId!: string;

  @Column({ name: 'solicitud_id', type: 'uuid' })
  solicitudId!: string;

  @Column({ name: 'tecnico_id', type: 'uuid' })
  tecnicoId!: string;

  @Column({
    type: 'enum',
    enum: AsignacionEstado,
    default: AsignacionEstado.reservado,
  })
  estado!: AsignacionEstado;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
