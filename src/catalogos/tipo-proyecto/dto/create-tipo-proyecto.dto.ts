import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateTipoProyectoDto {
  
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}