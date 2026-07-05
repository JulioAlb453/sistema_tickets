import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CategoriaTicket,
  TecnicoResponseDto,
} from '@sistema-tickets/shared-types';
import { ListTecnicosDisponiblesService } from './listTecnicosDisponibles.service';

@ApiTags('tecnicos')
@Controller('tecnicos')
export class ListTecnicosDisponiblesController {
  constructor(
    private readonly listTecnicosService: ListTecnicosDisponiblesService,
  ) {}

  @Get('disponibles')
  @ApiOperation({ summary: 'Listar técnicos disponibles' })
  @ApiQuery({ name: 'categoria', enum: CategoriaTicket, required: false })
  @ApiOkResponse({ type: [TecnicoResponseDto] })
  list(@Query('categoria') categoria?: CategoriaTicket) {
    return this.listTecnicosService.execute(categoria);
  }
}
