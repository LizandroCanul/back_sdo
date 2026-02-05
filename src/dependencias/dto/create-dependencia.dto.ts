import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDependenciaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Transform(({ value }) => value?.trim()) // Quita espacios vacíos
  nombre: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim().toUpperCase()) // Convierte a MAYÚSCULAS
  siglas?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}