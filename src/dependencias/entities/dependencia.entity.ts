import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('dependencias')
export class Dependencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  siglas: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean; // El interruptor de vida o muerte

  @CreateDateColumn({ type: 'timestamp', select: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updated_at: Date;
}