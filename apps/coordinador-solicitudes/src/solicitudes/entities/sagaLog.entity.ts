import { SagaPaso } from '@sistema-tickets/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('saga_logs')
export class SagaLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'solicitud_id', type: 'uuid' })
  solicitudId!: string;

  @Column({ type: 'enum', enum: SagaPaso })
  paso!: SagaPaso;

  @Column()
  exito!: boolean;

  @Column({ type: 'text', nullable: true })
  detalle!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
