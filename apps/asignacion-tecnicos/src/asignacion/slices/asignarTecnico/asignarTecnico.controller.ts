import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AsignacionResponseDto,
  AsignarTecnicoDto,
} from '@sistema-tickets/shared-types';
import { AsignarTecnicoService } from './asignarTecnico.service';

@ApiTags('asignaciones')
@Controller('asignaciones')
export class AsignarTecnicoController {
  constructor(private readonly asignarTecnicoService: AsignarTecnicoService) {}

  @Post()
  @ApiOperation({ summary: 'Reservar técnico para un ticket (paso 2 Saga)' })
  @ApiCreatedResponse({ type: AsignacionResponseDto })
  asignar(@Body() dto: AsignarTecnicoDto) {
    return this.asignarTecnicoService.execute(dto);
  }
}
