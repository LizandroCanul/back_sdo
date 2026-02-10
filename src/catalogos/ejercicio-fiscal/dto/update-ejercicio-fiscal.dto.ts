import { PartialType } from '@nestjs/mapped-types';
import { CreateEjercicioFiscalDto } from './create-ejercicio-fiscal.dto';

export class UpdateEjercicioFiscalDto extends PartialType(CreateEjercicioFiscalDto) {}
