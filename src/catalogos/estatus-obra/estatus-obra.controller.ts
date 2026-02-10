import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstatusObraService } from './estatus-obra.service';
import { CreateEstatusObraDto } from './dto/create-estatus-obra.dto';
import { UpdateEstatusObraDto } from './dto/update-estatus-obra.dto';

@Controller('estatus-obra')
export class EstatusObraController {
  constructor(private readonly estatusObraService: EstatusObraService) {}

  @Post()
  create(@Body() createDto: CreateEstatusObraDto) {
    return this.estatusObraService.create(createDto);
  }

  @Get()
  findAll() {
    return this.estatusObraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estatusObraService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEstatusObraDto) {
    return this.estatusObraService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estatusObraService.remove(+id);
  }
}