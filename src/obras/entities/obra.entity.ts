import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';
import { TipoProyecto } from '../../catalogos/tipo-proyecto/entities/tipo-proyecto.entity';
import { EstatusObra } from '../../catalogos/estatus-obra/entities/estatus-obra.entity';
import { EjercicioFiscal } from '../../catalogos/ejercicio-fiscal/entities/ejercicio-fiscal.entity';
// 👇 OJO: Ruta ajustada según tu imagen (está fuera de catalogos)
import { Dependencia } from '../../dependencias/entities/dependencia.entity'; 
import { ObraUbicacion } from './obra-ubicacion.entity';

@Entity('obras')
export class Obra {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // 1. NÚMERO DE OBRA (Consecutivo Anual - Se calcula solo)
  @Column({ name: 'numero_obra', type: 'int' })
  numeroObra: number;

  // 2. AÑO FISCAL
  @ManyToOne(() => EjercicioFiscal, { nullable: false, eager: true })
  @JoinColumn({ name: 'ejercicio_fiscal_id' })
  ejercicioFiscal: EjercicioFiscal;

  @Column({ name: 'ejercicio_fiscal_id' })
  ejercicioFiscalId: number;

  // 3. CLAVE ÚNICA (Irrepetible)
  @Column({ name: 'clave_unica', length: 50, unique: true })
  claveUnica: string;

  // 4. NOMBRE
  @Column({ length: 255 })
  nombre: string;

  // 5. DESCRIPCIÓN (Texto largo)
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // 6. DEPENDENCIA (Ruta corregida)
  @ManyToOne(() => Dependencia, { nullable: false, eager: true })
  @JoinColumn({ name: 'dependencia_id' })
  dependencia: Dependencia;

  @Column({ name: 'dependencia_id' })
  dependenciaId: number;

  // 7. MONTO (Dinero)
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  monto: number;

  // 8. MUNICIPIO
  @ManyToOne(() => Municipio, { nullable: false, eager: true })
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @Column({ name: 'municipio_id' })
  municipioId: number;

  // 9. TIPO DE PROYECTO
  @ManyToOne(() => TipoProyecto, { nullable: true, eager: true })
  @JoinColumn({ name: 'tipo_proyecto_id' })
  tipoProyecto: TipoProyecto;

  @Column({ name: 'tipo_proyecto_id', nullable: true })
  tipoProyectoId: number;

  // 10. ESTATUS OBRA
  @ManyToOne(() => EstatusObra, { nullable: false, eager: true })
  @JoinColumn({ name: 'estatus_obra_id' })
  estatusObra: EstatusObra;

  @Column({ name: 'estatus_obra_id' })
  estatusObraId: number;

  // --- HIJOS (Ubicaciones) ---
  @OneToMany(() => ObraUbicacion, (ubicacion) => ubicacion.obra, {
    cascade: true
  })
  ubicaciones: ObraUbicacion[];
}