import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_proyecto')
export class TipoProyecto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  nombre: string; // Ej: "INFRAESTRUCTURA VIAL", "EDUCACIÓN"

  @Column({ default: true })
  activo: boolean;
}