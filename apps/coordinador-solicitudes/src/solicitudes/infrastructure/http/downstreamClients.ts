import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AsignacionResponseDto,
  CancelTicketDto,
  ConfirmTicketDto,
  CreateTicketDto,
  TicketResponseDto,
} from '@sistema-tickets/shared-types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketsClient {
  private readonly baseUrl =
    process.env.TICKETS_SERVICE_URL ?? 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  createTicket(dto: CreateTicketDto) {
    return firstValueFrom(
      this.httpService.post<TicketResponseDto>(`${this.baseUrl}/tickets`, dto),
    ).then((r) => r.data);
  }

  confirmTicket(ticketId: string, dto: ConfirmTicketDto) {
    return firstValueFrom(
      this.httpService.patch<TicketResponseDto>(
        `${this.baseUrl}/tickets/${ticketId}/confirmar`,
        dto,
      ),
    ).then((r) => r.data);
  }

  cancelTicket(ticketId: string, dto: CancelTicketDto) {
    return firstValueFrom(
      this.httpService.patch<TicketResponseDto>(
        `${this.baseUrl}/tickets/${ticketId}/cancelar`,
        dto,
      ),
    ).then((r) => r.data);
  }
}

@Injectable()
export class AsignacionClient {
  private readonly baseUrl =
    process.env.ASIGNACION_SERVICE_URL ?? 'http://localhost:3002';

  constructor(private readonly httpService: HttpService) {}

  asignarTecnico(dto: {
    ticketId: string;
    solicitudId: string;
    categoria: string;
    prioridad: string;
  }) {
    return firstValueFrom(
      this.httpService.post<AsignacionResponseDto>(
        `${this.baseUrl}/asignaciones`,
        dto,
      ),
    ).then((r) => r.data);
  }

  liberarAsignacion(ticketId: string) {
    return firstValueFrom(
      this.httpService.delete(`${this.baseUrl}/asignaciones/${ticketId}`),
    ).then((r) => r.data);
  }
}
