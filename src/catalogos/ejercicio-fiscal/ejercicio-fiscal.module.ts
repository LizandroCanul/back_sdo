import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- IMPORTAR
import { EjercicioFiscalService } from './ejercicio-fiscal.service';
import { EjercicioFiscalController } from './ejercicio-fiscal.controller';
import { EjercicioFiscal } from './entities/ejercicio-fiscal.entity'; // <--- IMPORTAR

@Module({
  imports: [TypeOrmModule.forFeature([EjercicioFiscal])], // <--- REGISTRAR
  controllers: [EjercicioFiscalController],
  providers: [EjercicioFiscalService],
  exports: [EjercicioFiscalService] // Exportamos para usarlo en Obras
})
export class EjercicioFiscalModule {}