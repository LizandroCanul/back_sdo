import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { Sector } from './entities/sector.entity';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(Sector)
    private readonly repo: Repository<Sector>,
  ) {}

  async create(createDto: CreateSectorDto) {
    const nuevo = this.repo.create(createDto);
    return await this.repo.save(nuevo);
  }

  async findAll() {
    return await this.repo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async update(id: number, updateDto: UpdateSectorDto) {
    await this.repo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const sector = await this.findOne(id);
    if (!sector) {
      throw new NotFoundException(`Sector con id ${id} no encontrado`);
    }
    return await this.repo.remove(sector);
  }
}
