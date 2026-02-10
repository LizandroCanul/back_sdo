import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ejercicios_fiscales') // Nombre de tabla más formal
export class EjercicioFiscal {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', unique: true })
  anio: number; // Ej: 2025

  @Column({ default: true })
  activo: boolean;
}