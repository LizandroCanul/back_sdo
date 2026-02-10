import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEjercicioFiscalDto } from './dto/create-ejercicio-fiscal.dto';
import { UpdateEjercicioFiscalDto } from './dto/update-ejercicio-fiscal.dto';
import { EjercicioFiscal } from './entities/ejercicio-fiscal.entity';

@Injectable()
export class EjercicioFiscalService {
  constructor(
    @InjectRepository(EjercicioFiscal)
    private readonly repo: Repository<EjercicioFiscal>,
  ) {}

  async create(createDto: CreateEjercicioFiscalDto) {
    const nuevo = this.repo.create(createDto);
    return await this.repo.save(nuevo);
  }

  // LISTA COMPLETA (Admin)
  async findAll() {
    return await this.repo.find({ order: { anio: 'DESC' } });
  }

  // LISTA SOLO ACTIVOS (Dropdown Obra)
  async findAllActive() {
    return await this.repo.find({ 
      where: { activo: true },
      order: { anio: 'DESC' } 
    });
  }

  async findOne(id: number) {
    const ejercicio = await this.repo.findOneBy({ id });
    if (!ejercicio) throw new NotFoundException(`Ejercicio Fiscal ${id} no encontrado`);
    return ejercicio;
  }

  async update(id: number, updateDto: UpdateEjercicioFiscalDto) {
    const ejercicio = await this.repo.preload({ id, ...updateDto });
    if (!ejercicio) throw new NotFoundException(`Ejercicio Fiscal ${id} no encontrado`);
    return await this.repo.save(ejercicio);
  }

  // ELIMINAR BLOQUEADO
  async remove(id: number) {
    throw new BadRequestException(
      'No se puede eliminar un Ejercicio Fiscal. Por favor, desactívalo.'
    );
    //activar solo en caso de querer eliminar realmente un ejercicio fiscal
  const ejercicio = await this.findOne(id);
  return await this.repo.remove(ejercicio);
  }
}
