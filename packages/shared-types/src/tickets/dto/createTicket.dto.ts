import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CategoriaTicket, Prioridad } from '../../common';

export class CreateTicketDto {
  @IsUUID()
  solicitudId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  descripcion!: string;

  @IsEnum(Prioridad)
  prioridad!: Prioridad;

  @IsEnum(CategoriaTicket)
  categoria!: CategoriaTicket;

  @IsOptional()
  @IsUUID()
  solicitanteId?: string;
}
