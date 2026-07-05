import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto, TicketEstado } from '@sistema-tickets/shared-types';
import { Repository } from 'typeorm';
import { TicketEntity } from '../../entities/ticket.entity';
import { toTicketResponse } from '../../mappers/ticket.mapper';

@Injectable()
export class CreateTicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  async execute(dto: CreateTicketDto) {
    const ticket = this.ticketRepository.create({
      solicitudId: dto.solicitudId,
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      prioridad: dto.prioridad,
      categoria: dto.categoria,
      solicitanteId: dto.solicitanteId ?? null,
      estado: TicketEstado.pendiente,
      tecnicoId: null,
      notificado: false,
    });

    const saved = await this.ticketRepository.save(ticket);
    return toTicketResponse(saved);
  }
}
