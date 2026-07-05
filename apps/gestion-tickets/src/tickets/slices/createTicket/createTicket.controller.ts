import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTicketDto, TicketResponseDto } from '@sistema-tickets/shared-types';
import { CreateTicketService } from './createTicket.service';

@ApiTags('tickets')
@Controller('tickets')
export class CreateTicketController {
  constructor(private readonly createTicketService: CreateTicketService) {}

  @Post()
  @ApiOperation({ summary: 'Crear ticket provisional (paso 1 Saga)' })
  @ApiCreatedResponse({ type: TicketResponseDto })
  create(@Body() dto: CreateTicketDto) {
    return this.createTicketService.execute(dto);
  }
}
