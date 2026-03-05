import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sector')
export class Sector {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string; // Ej: "SALUD", "EDUCACIÓN", "INFRAESTRUCTURA", "SEGURIDAD"

  @Column({ default: true })
  activo: boolean;
}
