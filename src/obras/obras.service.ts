import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateObraDto } from './dto/create-obra.dto';
import { UpdateObraDto } from './dto/update-obra.dto';
import { Obra } from './entities/obra.entity';
import { ObraUbicacion } from './entities/obra-ubicacion.entity';

@Injectable()
export class ObrasService {
  constructor(
    @InjectRepository(Obra)
    private readonly obraRepository: Repository<Obra>,
    
    @InjectRepository(ObraUbicacion)
    private readonly ubicacionRepository: Repository<ObraUbicacion>,
  ) {}

  // --- CREAR (CON LÓGICA DE CONSECUTIVO) ---
  async create(createObraDto: CreateObraDto) {
    // 1. Validar Clave Única
    const existe = await this.obraRepository.findOneBy({ claveUnica: createObraDto.claveUnica });
    if (existe) throw new ConflictException(`La Clave Única '${createObraDto.claveUnica}' ya existe.`);

    // 2. CALCULAR NÚMERO DE OBRA
    const siguienteNumero = await this._generarSiguienteNumeroObra(createObraDto.ejercicioFiscalId);

    // 3. Crear Objeto
    const nuevaObra = this.obraRepository.create({
      ...createObraDto,
      numeroObra: siguienteNumero,
      municipio: { id: createObraDto.municipioId },
      tipoProyecto: createObraDto.tipoProyectoId ? { id: createObraDto.tipoProyectoId } : undefined,
      ejercicioFiscal: { id: createObraDto.ejercicioFiscalId },
      dependencia: { id: createObraDto.dependenciaId },
      estatusObra: { id: createObraDto.estatusObraId },
      ubicaciones: createObraDto.ubicaciones?.map(u => ({
        ...u,
        municipio: { id: u.municipioId } // Relación dentro de ubicación
      }))
    });

    return await this.obraRepository.save(nuevaObra);
  }

  // --- LEER TODOS ---
  async findAll() {
    return await this.obraRepository.find({
      relations: [
        'municipio', 'tipoProyecto', 'ejercicioFiscal', 'dependencia', 'estatusObra',
        'ubicaciones', 'ubicaciones.municipio'
      ],
      order: { id: 'DESC' }
    });
  }

  // --- LEER UNO ---
  async findOne(id: number) {
    const obra = await this.obraRepository.findOne({
      where: { id },
      relations: [
        'municipio', 'tipoProyecto', 'ejercicioFiscal', 'dependencia', 'estatusObra',
        'ubicaciones', 'ubicaciones.municipio'
      ],
      order: { ubicaciones: { orden: 'ASC' } }
    });
    if (!obra) throw new NotFoundException(`Obra ${id} no encontrada.`);
    return obra;
  }

  // --- ACTUALIZAR (CON BORRADO DE HUÉRFANOS) ---
  async update(id: number, updateObraDto: UpdateObraDto) {
    // 1. Lógica manual para detectar y borrar ubicaciones eliminadas
    if (updateObraDto.ubicaciones) {
      const obraOriginal = await this.findOne(id);
      
      // Obtenemos los IDs que vienen del Frontend (filtro para asegurar que traigan ID)
      const idsEntrantes = updateObraDto.ubicaciones
        .filter(u => u.id)
        .map(u => u.id);
      
      // Obtenemos los IDs que ya existen en la base de datos
      const idsExistentes = obraOriginal.ubicaciones.map(u => u.id);
      
      // Calculamos cuáles existen en BD pero NO vienen en el JSON (esos se borran)
      const idsParaBorrar = idsExistentes.filter(idBD => !idsEntrantes.includes(idBD));

      if (idsParaBorrar.length > 0) {
        await this.ubicacionRepository.delete({ id: In(idsParaBorrar) });
      }
    }

    // 2. Actualización de campos y relaciones
    const obra = await this.obraRepository.preload({
      id: id,
      ...updateObraDto,
      municipio: updateObraDto.municipioId ? { id: updateObraDto.municipioId } : undefined,
      tipoProyecto: updateObraDto.tipoProyectoId ? { id: updateObraDto.tipoProyectoId } : undefined,
      ejercicioFiscal: updateObraDto.ejercicioFiscalId ? { id: updateObraDto.ejercicioFiscalId } : undefined,
      dependencia: updateObraDto.dependenciaId ? { id: updateObraDto.dependenciaId } : undefined,
      estatusObra: updateObraDto.estatusObraId ? { id: updateObraDto.estatusObraId } : undefined,
      ubicaciones: updateObraDto.ubicaciones ? updateObraDto.ubicaciones.map(u => ({
        ...u,
        municipio: u.municipioId ? { id: u.municipioId } : undefined
      })) : undefined
    });

    if (!obra) throw new NotFoundException(`Obra ${id} no encontrada.`);
    return await this.obraRepository.save(obra);
  }

  // --- ELIMINAR ---
  async remove(id: number): Promise<void> {
    const obra = await this.findOne(id); 
    await this.obraRepository.remove(obra); 
  }

  // --- MÉTODO PRIVADO: GENERADOR DE FOLIOS ---
  private async _generarSiguienteNumeroObra(anioId: number): Promise<number> {
    const ultimaObra = await this.obraRepository.createQueryBuilder('obra')
      .where('obra.ejercicioFiscalId = :anioId', { anioId })
      .orderBy('obra.numeroObra', 'DESC')
      .getOne();

    return ultimaObra ? ultimaObra.numeroObra + 1 : 1;
  }
}