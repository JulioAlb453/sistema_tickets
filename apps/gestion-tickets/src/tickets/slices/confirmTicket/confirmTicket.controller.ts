import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ConfirmTicketDto,
  TicketResponseDto,
} from '@sistema-tickets/shared-types';
import { ConfirmTicketService } from './confirmTicket.service';

@ApiTags('tickets')
@Controller('tickets')
export class ConfirmTicketController {
  constructor(private readonly confirmTicketService: ConfirmTicketService) {}

  @Patch(':id/confirmar')
  @ApiOperation({ summary: 'Confirmar ticket (paso 3 Saga)' })
  @ApiOkResponse({ type: TicketResponseDto })
  confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ConfirmTicketDto,
  ) {
    return this.confirmTicketService.execute(id, dto);
  }
}
