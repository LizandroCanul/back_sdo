import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importar
import { EstatusObraService } from './estatus-obra.service';
import { EstatusObraController } from './estatus-obra.controller';
import { EstatusObra } from './entities/estatus-obra.entity'; // <--- Importar

@Module({
  imports: [TypeOrmModule.forFeature([EstatusObra])], // <--- REGISTRAR
  controllers: [EstatusObraController],
  providers: [EstatusObraService],
  exports: [EstatusObraService] // Exportamos por si lo usamos en validaciones futuras
})
export class EstatusObraModule {}