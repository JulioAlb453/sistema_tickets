import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CancelTicketDto,
  TicketEstado,
} from '@sistema-tickets/shared-types';
import { Repository } from 'typeorm';
import { TicketEntity } from '../../entities/ticket.entity';
import { toTicketResponse } from '../../mappers/ticket.mapper';

@Injectable()
export class CancelTicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  async execute(id: string, dto: CancelTicketDto) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} no encontrado`);
    }

    if (ticket.estado === TicketEstado.cancelado) {
      return toTicketResponse(ticket);
    }

    if (ticket.estado === TicketEstado.confirmado) {
      throw new BadRequestException(
        'No se puede cancelar un ticket ya confirmado',
      );
    }

    ticket.estado = TicketEstado.cancelado;
    const saved = await this.ticketRepository.save(ticket);
    return toTicketResponse(saved);
  }
}
