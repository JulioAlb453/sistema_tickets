import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketResponseDto } from '@sistema-tickets/shared-types';
import { GetTicketService } from './getTicket.service';

@ApiTags('tickets')
@Controller('tickets')
export class GetTicketController {
  constructor(private readonly getTicketService: GetTicketService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Consultar ticket por ID' })
  @ApiOkResponse({ type: TicketResponseDto })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.getTicketService.execute(id);
  }
}
