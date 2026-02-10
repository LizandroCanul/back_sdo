import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateEstatusObraDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}