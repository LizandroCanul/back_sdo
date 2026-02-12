    import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterObraDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Convierte "10" (string) a 10 (numero)
  @Min(1)
  limit?: number; // Cuántas obras por página

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number; // Qué página quieres ver

  @IsOptional()
  @IsString()
  search?: string; // Palabra clave (Ej: "Baños")

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ejercicioFiscalId?: number; // Filtrar por año

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  municipioId?: number; // Filtrar por municipio
}