import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm'; // <--- AGREGAMOS Brackets
import { CreateObraDto } from './dto/create-obra.dto';
import { UpdateObraDto } from './dto/update-obra.dto';
import { FilterObraDto } from './dto/filter-obra.dto'; // <--- IMPORTANTE
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
        municipio: { id: u.municipioId }
      }))
    });

    return await this.obraRepository.save(nuevaObra);
  }

  // --- BUSCADOR AVANZADO (findAll MODIFICADO) ---
  async findAll(filterDto: FilterObraDto) {
    const { limit = 10, page = 1, search, ejercicioFiscalId, municipioId } = filterDto;

    // 1. Iniciamos el QueryBuilder
    const query = this.obraRepository.createQueryBuilder('obra');

    // 2. Relaciones (Joins)
    query.leftJoinAndSelect('obra.municipio', 'municipio')
         .leftJoinAndSelect('obra.dependencia', 'dependencia')
         .leftJoinAndSelect('obra.ejercicioFiscal', 'ejercicioFiscal')
         .leftJoinAndSelect('obra.estatusObra', 'estatusObra')
         .leftJoinAndSelect('obra.tipoProyecto', 'tipoProyecto')
         .leftJoinAndSelect('obra.ubicaciones', 'ubicaciones');

    // 3. Filtros Exactos
    if (ejercicioFiscalId) {
      query.andWhere('obra.ejercicioFiscalId = :ejercicioFiscalId', { ejercicioFiscalId });
    }

    if (municipioId) {
      query.andWhere('obra.municipioId = :municipioId', { municipioId });
    }

    // 4. Búsqueda de Texto (Nombre, Descripción o Clave)
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('obra.nombre ILIKE :search', { search: `%${search}%` })
            .orWhere('obra.descripcion ILIKE :search', { search: `%${search}%` })
            .orWhere('obra.claveUnica ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    // 5. Paginación
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    // 6. Ordenar (Lo más reciente primero)
    query.orderBy('obra.id', 'DESC');

    // 7. Ejecutar y contar
    const [data, total] = await query.getManyAndCount();

    // 8. Retornar estructura para el Frontend
    return {
      data: data,
      meta: {
        totalItems: total,        // Total en BD (para saber cuántas páginas hay)
        itemCount: data.length,   // Cuántas devolví en esta petición
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
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

  // --- ACTUALIZAR ---
  async update(id: number, updateObraDto: UpdateObraDto) {
    if (updateObraDto.ubicaciones) {
      const obraOriginal = await this.findOne(id);
      const idsEntrantes = updateObraDto.ubicaciones.filter(u => u.id).map(u => u.id);
      const idsExistentes = obraOriginal.ubicaciones.map(u => u.id);
      const idsParaBorrar = idsExistentes.filter(idBD => !idsEntrantes.includes(idBD));

      if (idsParaBorrar.length > 0) {
        await this.ubicacionRepository.delete({ id: In(idsParaBorrar) });
      }
    }

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

  // --- PRIVADO ---
  private async _generarSiguienteNumeroObra(anioId: number): Promise<number> {
    const ultimaObra = await this.obraRepository.createQueryBuilder('obra')
      .where('obra.ejercicioFiscalId = :anioId', { anioId })
      .orderBy('obra.numeroObra', 'DESC')
      .getOne();

    return ultimaObra ? ultimaObra.numeroObra + 1 : 1;
  }
}