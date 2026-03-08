import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards, // <--- Necesario para activar la seguridad
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ObrasService } from './obras.service';
import { ObrasPdfService } from './obras-pdf.service';
import { CreateObraDto } from './dto/create-obra.dto';
import { UpdateObraDto } from './dto/update-obra.dto';
import { FilterObraDto } from './dto/filter-obra.dto';

// --- IMPORTACIONES DE SEGURIDAD ---
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('obras')
@UseGuards(JwtAuthGuard, RolesGuard) // <--- 1. CANDADO MAESTRO: Nadie entra sin Token
export class ObrasController {
  
  constructor(
    private readonly obrasService: ObrasService,
    private readonly obrasPdfService: ObrasPdfService,
  ) {}

  // --- SOLO ADMIN PUEDE CREAR ---
  @Post()
  @Roles('admin') // <--- VIP: Solo el jefe construye
  create(@Body() createObraDto: CreateObraDto) {
    return this.obrasService.create(createObraDto);
  }

  // --- TODOS LOS USUARIOS LOGUEADOS PUEDEN VER (Admin y User) ---
  @Get()
  // Sin @Roles -> Pasa cualquiera que tenga Token válido
  findAll(@Query() filterDto: FilterObraDto) {
    return this.obrasService.findAll(filterDto);
  }

  // --- REPORTE PDF DE MÚLTIPLES OBRAS (una por página) ---
  @Get('reporte/multiple')
  async generarReporteMultiple(@Query('ids') ids: string, @Res() res: Response) {
    const idsArray = ids.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

    const obras = await Promise.all(
      idsArray.map(id => this.obrasService.findOne(id)),
    );

    const pdfBuffer = await this.obrasPdfService.generarReporteMultiple(obras);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="reporte-obras-${idsArray.length}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  // --- REPORTE PDF DE UNA OBRA ---
  @Get(':id/reporte')
  async generarReporte(@Param('id') id: string, @Res() res: Response) {
    const obra = await this.obrasService.findOne(+id);
    const pdfBuffer = await this.obrasPdfService.generarReporteObra(obra);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="obra-${obra.numeroObra}-${obra.claveUnica}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  // --- TODOS LOS USUARIOS LOGUEADOS PUEDEN VER UNA ---
  @Get(':id')
  // Sin @Roles -> Pasa cualquiera que tenga Token válido
  findOne(@Param('id') id: string) {
    return this.obrasService.findOne(+id);
  }

  // --- SOLO ADMIN PUEDE EDITAR ---
  @Patch(':id')
  @Roles('admin') // <--- VIP: Solo el jefe corrige
  update(@Param('id') id: string, @Body() updateObraDto: UpdateObraDto) {
    return this.obrasService.update(+id, updateObraDto);
  }

  // --- SOLO ADMIN PUEDE BORRAR ---
  @Delete(':id')
  @Roles('admin') // <--- VIP: Solo el jefe demuele
  remove(@Param('id') id: string) {
    return this.obrasService.remove(+id);
  }
}