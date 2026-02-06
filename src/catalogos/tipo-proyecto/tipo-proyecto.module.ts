import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- OJO AQUÍ
import { TipoProyectoService } from './tipo-proyecto.service';
import { TipoProyectoController } from './tipo-proyecto.controller';
import { TipoProyecto } from './entities/tipo-proyecto.entity'; // <--- OJO AQUÍ

@Module({
  imports: [TypeOrmModule.forFeature([TipoProyecto])], // <--- REGISTRAR AQUÍ
  controllers: [TipoProyectoController],
  providers: [TipoProyectoService],
})
export class TipoProyectoModule {}