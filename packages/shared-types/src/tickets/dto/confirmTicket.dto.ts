import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class ConfirmTicketDto {
  @IsUUID()
  tecnicoId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}

export class CancelTicketDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  motivo!: string;
}
