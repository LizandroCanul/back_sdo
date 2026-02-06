import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';
// Importamos la nueva entidad correcta
import { TipoProyecto } from '../../catalogos/tipo-proyecto/entities/tipo-proyecto.entity';
import { ObraUbicacion } from './obra-ubicacion.entity';

@Entity('obras')
export class Obra {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  nombre: string;

  // --- RELACIÓN: TIPO DE PROYECTO (Antes Rubro) ---
  @ManyToOne(() => TipoProyecto, { nullable: true })
  @JoinColumn({ name: 'tipo_proyecto_id' })
  tipoProyecto: TipoProyecto;

  @Column({ name: 'tipo_proyecto_id', nullable: true })
  tipoProyectoId: number;
  // ------------------------------------------------

  // --- RELACIÓN: MUNICIPIO SEDE ---
  @ManyToOne(() => Municipio, { nullable: false })
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @Column({ name: 'municipio_id' })
  municipioId: number;

  // --- RELACIÓN: UBICACIONES (Puntos en el mapa) ---
  @OneToMany(() => ObraUbicacion, (ubicacion) => ubicacion.obra, {
    cascade: true       // Guarda los hijos automáticamente
  })
  ubicaciones: ObraUbicacion[];
}