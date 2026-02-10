import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional, IsPositive, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateObraUbicacionDto } from './create-obra-ubicacion.dto';

export class CreateObraDto {
  // 1. NumeroObra NO se pide (es automático)

  // 2. AÑO FISCAL
  @IsNumber()
  @IsNotEmpty()
  ejercicioFiscalId: number;

  // 3. CLAVE ÚNICA
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  claveUnica: string;

  // 4. NOMBRE
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  // 5. DESCRIPCIÓN
  @IsString()
  @IsOptional()
  descripcion?: string;

  // 6. DEPENDENCIA
  @IsNumber()
  @IsNotEmpty()
  dependenciaId: number;

  // 7. MONTO
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0)
  monto: number;

  // 8. MUNICIPIO
  @IsNumber()
  @IsNotEmpty()
  municipioId: number;

  // 9. TIPO PROYECTO
  @IsNumber()
  @IsOptional()
  tipoProyectoId?: number;

  // 10. ESTATUS
  @IsNumber()
  @IsNotEmpty()
  estatusObraId: number;

  // UBICACIONES
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateObraUbicacionDto)
  @IsOptional()
  ubicaciones?: CreateObraUbicacionDto[];
}