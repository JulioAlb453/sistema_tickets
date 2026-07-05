import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CancelTicketDto,
  TicketResponseDto,
} from '@sistema-tickets/shared-types';
import { CancelTicketService } from './cancelTicket.service';

@ApiTags('tickets')
@Controller('tickets')
export class CancelTicketController {
  constructor(private readonly cancelTicketService: CancelTicketService) {}

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar ticket (compensación Saga)' })
  @ApiOkResponse({ type: TicketResponseDto })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelTicketDto,
  ) {
    return this.cancelTicketService.execute(id, dto);
  }
}
