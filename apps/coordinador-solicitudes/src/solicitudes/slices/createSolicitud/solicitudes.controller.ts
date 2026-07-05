import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateSolicitudDto,
  EstadoSolicitudDto,
  SolicitudResponseDto,
} from '@sistema-tickets/shared-types';
import { JwtAuthGuard } from '../../../auth/guards/jwtAuth.guard';
import { SagaOrchestratorService } from './sagaOrchestrator.service';
import { GetEstadoSolicitudService } from '../getEstadoSolicitud/getEstadoSolicitud.service';

interface AuthenticatedRequest {
  user: { userId: string; email: string };
}

@ApiTags('solicitudes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('solicitudes')
export class SolicitudesController {
  constructor(
    private readonly sagaOrchestrator: SagaOrchestratorService,
    private readonly getEstadoService: GetEstadoSolicitudService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear solicitud y ejecutar Saga completa' })
  @ApiCreatedResponse({ type: SolicitudResponseDto })
  create(
    @Body() dto: CreateSolicitudDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.sagaOrchestrator.execute(dto, req.user.userId);
  }

  @Get(':id/estado')
  @ApiOperation({ summary: 'Consultar estado de una solicitud' })
  @ApiOkResponse({ type: EstadoSolicitudDto })
  getEstado(@Param('id', ParseUUIDPipe) id: string) {
    return this.getEstadoService.execute(id);
  }
}
