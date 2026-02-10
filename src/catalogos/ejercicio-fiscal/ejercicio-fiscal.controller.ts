import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EjercicioFiscalService } from './ejercicio-fiscal.service';
import { CreateEjercicioFiscalDto } from './dto/create-ejercicio-fiscal.dto';
import { UpdateEjercicioFiscalDto } from './dto/update-ejercicio-fiscal.dto';

@Controller('ejercicio-fiscal') // La ruta será: localhost:3000/ejercicio-fiscal
export class EjercicioFiscalController {
  constructor(private readonly service: EjercicioFiscalService) {}

  @Post()
  create(@Body() createDto: CreateEjercicioFiscalDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('activos')
  findAllActive() {
    return this.service.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEjercicioFiscalDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}