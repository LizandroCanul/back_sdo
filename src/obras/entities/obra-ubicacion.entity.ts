import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Obra } from './obra.entity';
// Asegúrate de que esta ruta a municipio sea correcta (según donde tengas tu carpeta municipios)
import { Municipio } from '../../municipios/entities/municipio.entity'; 

export enum TipoGeometria {
  PUNTO = 'PUNTO',
  RUTA = 'RUTA',
  POLIGONO = 'POLIGONO',
}

@Entity('obra_ubicaciones')
export class ObraUbicacion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // 1. MUNICIPIO INDIVIDUAL (Cada punto tiene el suyo)
  @ManyToOne(() => Municipio, { nullable: false })
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @Column({ name: 'municipio_id' })
  municipioId: number;

  // 2. COLUMNAS VISUALES (Tu tabla negra)
  @Column({ length: 255 })
  direccion: string; 

  @Column({ name: 'localidad_referencia', length: 150, nullable: true })
  localidadReferencia: string; 

  @Column({ name: 'referencia_lugar', length: 150, nullable: true })
  referenciaLugar: string; 

  // 3. DATOS TÉCNICOS OCULTOS (Mapa)
  @Column({ type: 'enum', enum: TipoGeometria, default: TipoGeometria.PUNTO })
  tipoGeometria: TipoGeometria;

  @Column({ name: 'geometria_json', type: 'json' }) 
  geometriaJson: any; 

  @Column({ default: 0 })
  orden: number;

  // 4. VINCULO CON LA OBRA PADRE
  @ManyToOne(() => Obra, (obra) => obra.ubicaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'obra_id' })
  obra: Obra;
}