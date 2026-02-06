import { Module } from '@nestjs/common';
import { LocalidadService } from './localidad.service';
import { LocalidadController } from './localidad.controller';

@Module({
  controllers: [LocalidadController],
  providers: [LocalidadService],
})
export class LocalidadModule {}
