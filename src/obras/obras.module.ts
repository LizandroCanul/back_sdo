import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObrasService } from './obras.service';
import { ObrasPdfService } from './obras-pdf.service';
import { ObrasController } from './obras.controller';
import { Obra } from './entities/obra.entity';
import { ObraUbicacion } from './entities/obra-ubicacion.entity';
import { UserFavoriteObra } from '../users/entities/user-favorite-obra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Obra, ObraUbicacion, UserFavoriteObra])], 
  controllers: [ObrasController],
  providers: [ObrasService, ObrasPdfService],
})
export class ObrasModule {}