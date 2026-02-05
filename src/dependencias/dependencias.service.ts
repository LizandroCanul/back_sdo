import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDependenciaDto } from './dto/create-dependencia.dto';
import { UpdateDependenciaDto } from './dto/update-dependencia.dto';
import { Dependencia } from './entities/dependencia.entity';

@Injectable()
export class DependenciasService {
  constructor(
    @InjectRepository(Dependencia)
    private readonly dependenciaRepository: Repository<Dependencia>,
  ) {}

  async create(createDependenciaDto: CreateDependenciaDto) {
    const nueva = this.dependenciaRepository.create(createDependenciaDto);
    return await this.dependenciaRepository.save(nueva);
  }

  // Lógica: Por defecto solo trae ACTIVOS. Si includeInactive es true, trae TODO.
  async findAll(includeInactive: boolean = false) {
    const query = this.dependenciaRepository.createQueryBuilder('dep');

    if (!includeInactive) {
      query.where('dep.activo = :activo', { activo: true });
    }

    query.orderBy('dep.nombre', 'ASC'); // Siempre ordenado A-Z
    return await query.getMany();
  }

  async findOne(id: number) {
    const dependencia = await this.dependenciaRepository.findOneBy({ id });
    if (!dependencia) throw new NotFoundException(`Dependencia #${id} no encontrada`);
    return dependencia;
  }

  async update(id: number, updateDependenciaDto: UpdateDependenciaDto) {
    const dependencia = await this.findOne(id); // Verificamos que exista primero
    // Hacemos merge de los datos nuevos sobre los viejos
    this.dependenciaRepository.merge(dependencia, updateDependenciaDto);
    return await this.dependenciaRepository.save(dependencia);
  }

  // Lógica SOFT DELETE: No borramos, solo apagamos.
  async remove(id: number) {
    const dependencia = await this.findOne(id);
    dependencia.activo = false;
    return await this.dependenciaRepository.save(dependencia);
  }
}