import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estatus_obra')
export class EstatusObra {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string; // Ej: "PROGRAMADA", "EN PROCESO", "SUSPENDIDA", "TERMINADA"

  @Column({ default: true })
  activo: boolean;
}