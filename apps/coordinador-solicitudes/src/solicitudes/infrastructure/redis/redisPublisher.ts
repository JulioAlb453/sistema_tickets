import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  EVENTO_SOLICITUD_COMPLETADA,
  REDIS_CHANNEL_SOLICITUD_COMPLETADA,
  SolicitudCompletadaEvent,
} from '@sistema-tickets/shared-types';
import Redis from 'ioredis';

@Injectable()
export class RedisPublisher implements OnModuleDestroy {
  private readonly logger = new Logger(RedisPublisher.name);
  private readonly publisher: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
    this.publisher = new Redis(redisUrl);
  }

  async publishSolicitudCompletada(event: SolicitudCompletadaEvent) {
    const payload = JSON.stringify({
      ...event,
      evento: EVENTO_SOLICITUD_COMPLETADA,
    });

    await this.publisher.publish(REDIS_CHANNEL_SOLICITUD_COMPLETADA, payload);
    this.logger.log(
      `Evento publicado en ${REDIS_CHANNEL_SOLICITUD_COMPLETADA}: ${event.solicitudId}`,
    );
  }

  async onModuleDestroy() {
    await this.publisher.quit();
  }
}
