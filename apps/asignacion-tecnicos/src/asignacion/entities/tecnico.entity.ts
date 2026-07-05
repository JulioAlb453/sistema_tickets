import { CategoriaTicket, TecnicoEstado } from '@sistema-tickets/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tecnicos')
export class TecnicoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ type: 'enum', enum: CategoriaTicket, array: true })
  especialidades!: CategoriaTicket[];

  @Column({
    type: 'enum',
    enum: TecnicoEstado,
    default: TecnicoEstado.disponible,
  })
  estado!: TecnicoEstado;

  @Column({ name: 'carga_actual', default: 0 })
  cargaActual!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
