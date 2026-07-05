import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TecnicoEntity } from './entities/tecnico.entity';
import { AsignacionEntity } from './entities/asignacion.entity';
import { AsignarTecnicoController } from './slices/asignarTecnico/asignarTecnico.controller';
import { AsignarTecnicoService } from './slices/asignarTecnico/asignarTecnico.service';
import { LiberarAsignacionController } from './slices/liberarAsignacion/liberarAsignacion.controller';
import { LiberarAsignacionService } from './slices/liberarAsignacion/liberarAsignacion.service';
import { ListTecnicosDisponiblesController } from './slices/listTecnicosDisponibles/listTecnicosDisponibles.controller';
import { ListTecnicosDisponiblesService } from './slices/listTecnicosDisponibles/listTecnicosDisponibles.service';
import { TecnicosSeedService } from './infrastructure/seed/tecnicosSeed.service';

@Module({
  imports: [TypeOrmModule.forFeature([TecnicoEntity, AsignacionEntity])],
  controllers: [
    AsignarTecnicoController,
    LiberarAsignacionController,
    ListTecnicosDisponiblesController,
  ],
  providers: [
    AsignarTecnicoService,
    LiberarAsignacionService,
    ListTecnicosDisponiblesService,
    TecnicosSeedService,
  ],
})
export class AsignacionModule {}
