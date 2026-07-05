import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaTicket, TecnicoEstado } from '@sistema-tickets/shared-types';
import { Repository } from 'typeorm';
import { TecnicoEntity } from '../../entities/tecnico.entity';
import { toTecnicoResponse } from '../../mappers/asignacion.mapper';

@Injectable()
export class ListTecnicosDisponiblesService {
  constructor(
    @InjectRepository(TecnicoEntity)
    private readonly tecnicoRepository: Repository<TecnicoEntity>,
  ) {}

  async execute(categoria?: CategoriaTicket) {
    const tecnicos = await this.tecnicoRepository.find({
      where: { estado: TecnicoEstado.disponible },
      order: { cargaActual: 'ASC' },
    });

    const filtered = categoria
      ? tecnicos.filter((t) => t.especialidades.includes(categoria))
      : tecnicos;

    return filtered.map(toTecnicoResponse);
  }
}
