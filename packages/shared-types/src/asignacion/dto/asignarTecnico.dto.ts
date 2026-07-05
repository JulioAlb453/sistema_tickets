import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CategoriaTicket, Prioridad } from '../../common';

export class AsignarTecnicoDto {
  @IsUUID()
  ticketId!: string;

  @IsUUID()
  solicitudId!: string;

  @IsEnum(CategoriaTicket)
  categoria!: CategoriaTicket;

  @IsEnum(Prioridad)
  prioridad!: Prioridad;

  @IsOptional()
  @IsUUID()
  tecnicoIdPreferido?: string;
}
