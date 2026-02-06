import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// RUTA AJUSTADA: Salimos de entities(1), de localidades(2), de catalogos(3) para hallar municipios
import { Municipio } from '../../../municipios/entities/municipio.entity'; 

@Entity('localidades')
export class Localidad {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  nombre: string; 

  @Column({ nullable: true })
  clave: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Municipio, { nullable: false })
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @Column({ name: 'municipio_id' })
  municipioId: number;
}