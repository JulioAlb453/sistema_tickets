import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoriaTicket,
  TecnicoEstado,
} from '@sistema-tickets/shared-types';
import { Repository } from 'typeorm';
import { TecnicoEntity } from '../../entities/tecnico.entity';

@Injectable()
export class TecnicosSeedService implements OnModuleInit {
  private readonly logger = new Logger(TecnicosSeedService.name);

  constructor(
    @InjectRepository(TecnicoEntity)
    private readonly tecnicoRepository: Repository<TecnicoEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.tecnicoRepository.count();
    if (count > 0) {
      return;
    }

    const tecnicos = [
      {
        nombre: 'Ana García',
        email: 'ana.garcia@empresa.com',
        especialidades: [CategoriaTicket.bug, CategoriaTicket.incidente],
        estado: TecnicoEstado.disponible,
        cargaActual: 0,
      },
      {
        nombre: 'Carlos Ruiz',
        email: 'carlos.ruiz@empresa.com',
        especialidades: [CategoriaTicket.feature, CategoriaTicket.soporte],
        estado: TecnicoEstado.disponible,
        cargaActual: 0,
      },
      {
        nombre: 'María López',
        email: 'maria.lopez@empresa.com',
        especialidades: [
          CategoriaTicket.bug,
          CategoriaTicket.feature,
          CategoriaTicket.soporte,
        ],
        estado: TecnicoEstado.disponible,
        cargaActual: 0,
      },
    ];

    await this.tecnicoRepository.save(
      tecnicos.map((t) => this.tecnicoRepository.create(t)),
    );

    this.logger.log('Técnicos de prueba sembrados correctamente');
  }
}
