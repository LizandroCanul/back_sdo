import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipiosService } from './municipios.service';
import { MunicipiosController } from './municipios.controller';
import { Municipio } from './entities/municipio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Municipio])],
  controllers: [MunicipiosController],
  providers: [MunicipiosService],
  exports: [TypeOrmModule] // Exportamos para que Obras pueda validar IDs
})
export class MunicipiosModule {}