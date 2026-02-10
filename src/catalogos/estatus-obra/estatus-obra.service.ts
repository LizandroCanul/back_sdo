import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstatusObraDto } from './dto/create-estatus-obra.dto';
import { UpdateEstatusObraDto } from './dto/update-estatus-obra.dto';
import { EstatusObra } from './entities/estatus-obra.entity';

@Injectable()
export class EstatusObraService {
  constructor(
    @InjectRepository(EstatusObra)
    private readonly repo: Repository<EstatusObra>,
  ) {}

  async create(createDto: CreateEstatusObraDto) {
    const nuevo = this.repo.create(createDto);
    return await this.repo.save(nuevo);
  }

  async findAll() {
    // Ordenamos alfabéticamente para que el dropdown se vea ordenado
    return await this.repo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async update(id: number, updateDto: UpdateEstatusObraDto) {
    await this.repo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const estatus = await this.findOne(id);
    if (!estatus) {
      throw new NotFoundException(`Estatus de obra con id ${id} no encontrado`);
    }
    return await this.repo.remove(estatus);
  }
}