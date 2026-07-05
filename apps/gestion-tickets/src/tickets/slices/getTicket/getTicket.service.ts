import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketEntity } from '../../entities/ticket.entity';
import { toTicketResponse } from '../../mappers/ticket.mapper';

@Injectable()
export class GetTicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  async execute(id: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} no encontrado`);
    }
    return toTicketResponse(ticket);
  }
}
