import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateObraUbicacionDto } from './create-obra-ubicacion.dto';

export class CreateObraDto {
  
  @IsString()
  @IsNotEmpty()
  nombre: string;

  // --- NUEVO CAMPO: ID DEL TIPO DE PROYECTO ---
  @IsNumber()
  @IsOptional()
  tipoProyectoId?: number;
  // --------------------------------------------

  @IsNumber()
  @IsNotEmpty()
  municipioId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateObraUbicacionDto)
  ubicaciones: CreateObraUbicacionDto[];
}