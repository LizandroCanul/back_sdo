import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoProyectoDto } from './dto/create-tipo-proyecto.dto';
import { UpdateTipoProyectoDto } from './dto/update-tipo-proyecto.dto';
import { TipoProyecto } from './entities/tipo-proyecto.entity';

@Injectable()
export class TipoProyectoService {
  constructor(
    @InjectRepository(TipoProyecto)
    private readonly tipoProyectoRepo: Repository<TipoProyecto>,
  ) {}

  async create(createTipoProyectoDto: CreateTipoProyectoDto) {
    const nuevo = this.tipoProyectoRepo.create(createTipoProyectoDto);
    return await this.tipoProyectoRepo.save(nuevo); // Retorna el objeto con su nuevo ID
  }

  async findAll() {
    return await this.tipoProyectoRepo.find(); // Retorna la lista real de la BD
  }

  async findOne(id: number) {
    return await this.tipoProyectoRepo.findOneBy({ id });
  }

  async update(id: number, updateDto: UpdateTipoProyectoDto) {
    await this.tipoProyectoRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const registro = await this.findOne(id);
    if (!registro) {
      throw new NotFoundException(`El tipo de proyecto con ID ${id} no existe.`);
    }
    return await this.tipoProyectoRepo.remove(registro);
  }
}