import { IsNumber, IsNotEmpty, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateEjercicioFiscalDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(2000)
  @Max(2100)
  anio: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}