import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudEntity } from './entities/solicitud.entity';
import { SagaLogEntity } from './entities/sagaLog.entity';
import { SolicitudesController } from './slices/createSolicitud/solicitudes.controller';
import { SagaOrchestratorService } from './slices/createSolicitud/sagaOrchestrator.service';
import { GetEstadoSolicitudService } from './slices/getEstadoSolicitud/getEstadoSolicitud.service';
import {
  AsignacionClient,
  TicketsClient,
} from './infrastructure/http/downstreamClients';
import { RedisPublisher } from './infrastructure/redis/redisPublisher';

@Module({
  imports: [
    HttpModule.register({ timeout: 10000 }),
    TypeOrmModule.forFeature([SolicitudEntity, SagaLogEntity]),
  ],
  controllers: [SolicitudesController],
  providers: [
    SagaOrchestratorService,
    GetEstadoSolicitudService,
    TicketsClient,
    AsignacionClient,
    RedisPublisher,
  ],
})
export class SolicitudesModule {}
