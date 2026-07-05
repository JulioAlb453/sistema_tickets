import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConfirmTicketDto,
  TicketEstado,
} from '@sistema-tickets/shared-types';
import { Repository } from 'typeorm';
import { TicketEntity } from '../../entities/ticket.entity';
import { toTicketResponse } from '../../mappers/ticket.mapper';

@Injectable()
export class ConfirmTicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  async execute(id: string, dto: ConfirmTicketDto) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} no encontrado`);
    }

    if (
      ticket.estado !== TicketEstado.pendiente &&
      ticket.estado !== TicketEstado.asignado
    ) {
      throw new BadRequestException(
        `No se puede confirmar un ticket en estado ${ticket.estado}`,
      );
    }

    if (process.env.SIMULATE_CONFIRM_ERROR === 'true') {
      throw new BadRequestException(
        'Error simulado al confirmar ticket (compensación Saga)',
      );
    }

    ticket.estado = TicketEstado.confirmado;
    ticket.tecnicoId = dto.tecnicoId;

    const saved = await this.ticketRepository.save(ticket);
    return toTicketResponse(saved);
  }
}
