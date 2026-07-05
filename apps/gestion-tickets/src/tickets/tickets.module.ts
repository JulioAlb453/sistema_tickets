import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from './entities/ticket.entity';
import { TicketEventoAuditoriaEntity } from './entities/ticketEventoAuditoria.entity';
import { CreateTicketController } from './slices/createTicket/createTicket.controller';
import { CreateTicketService } from './slices/createTicket/createTicket.service';
import { GetTicketController } from './slices/getTicket/getTicket.controller';
import { GetTicketService } from './slices/getTicket/getTicket.service';
import { ConfirmTicketController } from './slices/confirmTicket/confirmTicket.controller';
import { ConfirmTicketService } from './slices/confirmTicket/confirmTicket.service';
import { CancelTicketController } from './slices/cancelTicket/cancelTicket.controller';
import { CancelTicketService } from './slices/cancelTicket/cancelTicket.service';
import { SolicitudCompletadaConsumer } from './infrastructure/redis/solicitudCompletada.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketEntity, TicketEventoAuditoriaEntity]),
  ],
  controllers: [
    CreateTicketController,
    GetTicketController,
    ConfirmTicketController,
    CancelTicketController,
  ],
  providers: [
    CreateTicketService,
    GetTicketService,
    ConfirmTicketService,
    CancelTicketService,
    SolicitudCompletadaConsumer,
  ],
})
export class TicketsModule {}
