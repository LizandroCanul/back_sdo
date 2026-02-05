import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';

@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Get()
  findAll() {
    return this.municipiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.municipiosService.findOne(id);
  }
}