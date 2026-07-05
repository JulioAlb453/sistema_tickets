import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudEntity } from '../../entities/solicitud.entity';
import { toEstadoSolicitud } from '../../mappers/solicitud.mapper';

@Injectable()
export class GetEstadoSolicitudService {
  constructor(
    @InjectRepository(SolicitudEntity)
    private readonly solicitudRepository: Repository<SolicitudEntity>,
  ) {}

  async execute(id: string) {
    const solicitud = await this.solicitudRepository.findOne({ where: { id } });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud ${id} no encontrada`);
    }
    return toEstadoSolicitud(solicitud);
  }
}
