import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DependenciasService } from './dependencias.service';
import { DependenciasController } from './dependencias.controller';
import { Dependencia } from './entities/dependencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dependencia])],
  controllers: [DependenciasController],
  providers: [DependenciasService],
  exports: [TypeOrmModule] // Exportamos por si alguien más necesita consultar dependencias
})
export class DependenciasModule {}