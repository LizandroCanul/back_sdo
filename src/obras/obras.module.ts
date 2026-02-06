import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObrasService } from './obras.service';
import { ObrasController } from './obras.controller';
import { Obra } from './entities/obra.entity';
import { ObraUbicacion } from './entities/obra-ubicacion.entity'; // <--- Importar

@Module({
  // ¡OJO AQUÍ! Deben estar las DOS entidades dentro de los corchetes []
  imports: [TypeOrmModule.forFeature([Obra, ObraUbicacion])], 
  controllers: [ObrasController],
  providers: [ObrasService],
})
export class ObrasModule {}