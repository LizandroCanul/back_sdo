import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // <--- Importamos 'In' para consultas de arrays
import { CreateObraDto } from './dto/create-obra.dto';
import { UpdateObraDto } from './dto/update-obra.dto';
import { Obra } from './entities/obra.entity';
import { ObraUbicacion } from './entities/obra-ubicacion.entity'; // <--- Importamos la entidad hija

@Injectable()
export class ObrasService {
  constructor(
    @InjectRepository(Obra)
    private readonly obraRepository: Repository<Obra>,

    // Inyectamos el repositorio de Ubicaciones para poder borrar manualmente
    @InjectRepository(ObraUbicacion)
    private readonly ubicacionRepository: Repository<ObraUbicacion>,
  ) {}

  // --- CREAR (POST) ---
  async create(createObraDto: CreateObraDto) {
    const nuevaObra = this.obraRepository.create({
      ...createObraDto,
      // Relaciones obligatorias
      municipio: { id: createObraDto.municipioId },
      // Relaciones opcionales (Tipo Proyecto)
      tipoProyecto: createObraDto.tipoProyectoId ? { id: createObraDto.tipoProyectoId } : undefined,
      // Relaciones Hijos (Ubicaciones)
      ubicaciones: createObraDto.ubicaciones.map(ubicacion => ({
        ...ubicacion,
        municipio: { id: ubicacion.municipioId }
      }))
    });

    return await this.obraRepository.save(nuevaObra);
  }

  // --- LISTAR TODOS (GET) ---
  async findAll() {
    return await this.obraRepository.find({
      relations: [
        'municipio',                 // Datos del Municipio Sede
        'tipoProyecto',              // Datos de la Categoría (Pavimentación, etc.)
        'ubicaciones',               // Lista de puntos
        'ubicaciones.municipio'      // Municipio de cada punto
      ],
      order: { id: 'DESC' }
    });
  }

  // --- VER UNO (GET :id) ---
  async findOne(id: number) {
    const obra = await this.obraRepository.findOne({
      where: { id },
      relations: [
        'municipio',
        'tipoProyecto',
        'ubicaciones',
        'ubicaciones.municipio'
      ],
      order: {
        ubicaciones: {
          orden: 'ASC' // Ordenar los puntos (1, 2, 3...)
        }
      }
    });

    if (!obra) {
      throw new NotFoundException(`La obra con ID ${id} no existe.`);
    }

    return obra;
  }

  // --- EDITAR (PATCH :id) - LÓGICA MANUAL DE BORRADO ---
  async update(id: number, updateObraDto: UpdateObraDto) {
    
    // 1. Si vienen ubicaciones, verificamos si hay que BORRAR alguna (Orphan Removal Manual)
    if (updateObraDto.ubicaciones) {
      const obraOriginal = await this.findOne(id);

      // A. IDs que vienen en el JSON (Los que sobreviven o se actualizan)
      const idsEntrantes = updateObraDto.ubicaciones
        .filter(u => u.id) // Solo los que tienen ID
        .map(u => u.id);

      // B. IDs que existen en la BD actualmente
      const idsExistentes = obraOriginal.ubicaciones.map(u => u.id);

      // C. Filtramos: ¿Qué IDs existen en BD pero NO vinieron en el JSON? -> Borrarlos
      const idsParaBorrar = idsExistentes.filter(idBD => !idsEntrantes.includes(idBD));

      if (idsParaBorrar.length > 0) {
        await this.ubicacionRepository.delete({ id: In(idsParaBorrar) });
      }
    }

    // 2. Preparamos la actualización normal (Crear nuevos y Editar existentes)
    const obra = await this.obraRepository.preload({
      id: id,
      ...updateObraDto,
      municipio: updateObraDto.municipioId ? { id: updateObraDto.municipioId } : undefined,
      tipoProyecto: updateObraDto.tipoProyectoId ? { id: updateObraDto.tipoProyectoId } : undefined,
      ubicaciones: updateObraDto.ubicaciones ? updateObraDto.ubicaciones.map(u => ({
        ...u,
        municipio: u.municipioId ? { id: u.municipioId } : undefined
      })) : undefined
    });

    if (!obra) {
      throw new NotFoundException(`No se encontró la obra con ID ${id} para actualizar.`);
    }

    return await this.obraRepository.save(obra);
  }

  // --- ELIMINAR (DELETE :id) ---
  async remove(id: number) {
    const obra = await this.findOne(id);
    return await this.obraRepository.remove(obra);
  }
}