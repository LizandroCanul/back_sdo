import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Point } from 'geojson'; // 👈 Corrección de "isolatedModules" aplicada

@Entity('municipios')
export class Municipio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  nombre: string;

  // 🌍 ANCLA: Solo el punto central para que el mapa sepa a dónde volar
  @Index({ spatial: true }) 
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point', 
    srid: 4326, 
    nullable: true,
  })
  ubicacion: Point; 

  // 🛡️ SOFT DELETE: Para que nunca pierdas datos históricos
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}