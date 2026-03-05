import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
