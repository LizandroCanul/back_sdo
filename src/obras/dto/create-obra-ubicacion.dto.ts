import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { TipoGeometria } from '../entities/obra-ubicacion.entity';

export class CreateObraUbicacionDto {
  
  // --- AGREGA ESTO ---
  @IsNumber()
  @IsOptional()
  id?: number; // <--- Necesario para identificar qué fila actualizar
  // -------------------

  // 1. MUNICIPIO
  @IsNumber()
  @IsNotEmpty()
  municipioId: number;

  // 2. DATOS VISUALES
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsOptional()
  localidadReferencia?: string;

  @IsString()
  @IsOptional()
  referenciaLugar?: string;

  // 3. DATOS TÉCNICOS
  @IsEnum(TipoGeometria)
  @IsOptional()
  tipoGeometria?: TipoGeometria;

  @IsOptional() 
  geometriaJson?: any; 

  @IsNumber()
  @IsOptional()
  orden?: number;
}