import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LiberarAsignacionResponseDto } from '@sistema-tickets/shared-types';
import { LiberarAsignacionService } from './liberarAsignacion.service';

@ApiTags('asignaciones')
@Controller('asignaciones')
export class LiberarAsignacionController {
  constructor(
    private readonly liberarAsignacionService: LiberarAsignacionService,
  ) {}

  @Delete(':ticketId')
  @ApiOperation({ summary: 'Liberar técnico (compensación Saga)' })
  @ApiOkResponse({ type: LiberarAsignacionResponseDto })
  liberar(@Param('ticketId', ParseUUIDPipe) ticketId: string) {
    return this.liberarAsignacionService.execute(ticketId);
  }
}
