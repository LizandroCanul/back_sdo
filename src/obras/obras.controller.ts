import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards // <--- Necesario para activar la seguridad
} from '@nestjs/common';
import { ObrasService } from './obras.service';
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
  
  constructor(private readonly obrasService: ObrasService) {}

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