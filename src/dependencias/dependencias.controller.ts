import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { DependenciasService } from './dependencias.service';
import { CreateDependenciaDto } from './dto/create-dependencia.dto';
import { UpdateDependenciaDto } from './dto/update-dependencia.dto';

@Controller('dependencias')
export class DependenciasController {
  constructor(private readonly dependenciasService: DependenciasService) {}

  @Post()
  create(@Body() createDependenciaDto: CreateDependenciaDto) {
    return this.dependenciasService.create(createDependenciaDto);
  }

  // Ejemplo de llamada: GET /dependencias?ver_todo=true
  @Get()
  findAll(@Query('ver_todo') verTodo?: string) {
    const mostrarInactivos = verTodo === 'true'; // Convertimos texto a booleano
    return this.dependenciasService.findAll(mostrarInactivos);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dependenciasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDependenciaDto: UpdateDependenciaDto) {
    return this.dependenciasService.update(id, updateDependenciaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dependenciasService.remove(id);
  }
}