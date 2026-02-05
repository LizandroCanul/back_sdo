import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMunicipioDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  nombre: string;

  // El Frontend envía esto (Ej: 20.967)
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  latitud: number;

  // El Frontend envía esto (Ej: -89.592)
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  longitud: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}