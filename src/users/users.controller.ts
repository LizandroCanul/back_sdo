import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe, 
  UseGuards, 
  ForbiddenException,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// --- IMPORTACIONES DE SEGURIDAD ---
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // 1. Protegemos TODAS las rutas de este controlador
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- SOLO ADMIN PUEDE CREAR ---
  @Post()
  @Roles('admin') // 2. Solo el rol 'admin' puede crear usuarios
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // --- SOLO ADMIN PUEDE VER LA LISTA COMPLETA ---
  @Get()
  @Roles('admin') // 3. Solo el rol 'admin' puede ver el listado
  findAll() {
    return this.usersService.findAll();
  }

  // --- VER PERFIL (Admin o El Dueño de la cuenta) ---
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: any // 4. Obtenemos quién hace la petición
  ) {
    // Validación: Si no es Admin Y el ID que busca no es el suyo -> ERROR
    if (user.roles !== 'admin' && user.userId !== id) {
      throw new ForbiddenException('No tienes permiso para ver este perfil.');
    }
    return this.usersService.findOne(id);
  }

  // --- ACTUALIZAR (Admin o El Dueño de la cuenta) ---
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: any // 5. Obtenemos quién hace la petición
  ) {
    // Validación Anti-Hackeo: Si no es Admin Y quiere editar otro ID -> ERROR
    if (user.roles !== 'admin' && user.userId !== id) {
      throw new ForbiddenException('No puedes modificar los datos de otro usuario.');
    }
    return this.usersService.update(id, updateUserDto);
  }

  // --- SOLO ADMIN PUEDE ELIMINAR ---
  @Delete(':id')
  @Roles('admin') // 6. Solo el rol 'admin' puede borrar
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  // --- OBRAS FAVORITAS ---

  // Agregar una obra a favoritas
  @Post(':id/favorites/:obraId')
  addFavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('obraId', ParseIntPipe) obraId: number,
    @GetUser() user: any
  ) {
    // Validación: Solo puede agregar favoritas a su propio perfil
    if (user.userId !== id) {
      throw new ForbiddenException('No puedes modificar los favoritos de otro usuario.');
    }
    return this.usersService.addFavorite(id, obraId);
  }

  // Remover una obra de favoritas
  @Delete(':id/favorites/:obraId')
  removeFavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('obraId', ParseIntPipe) obraId: number,
    @GetUser() user: any
  ) {
    // Validación: Solo puede remover favoritas de su propio perfil
    if (user.userId !== id) {
      throw new ForbiddenException('No puedes modificar los favoritos de otro usuario.');
    }
    return this.usersService.removeFavorite(id, obraId);
  }

  // Ver todas las obras favoritas de un usuario
  @Get(':id/favorites')
  getFavorites(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @GetUser() user?: any
  ) {
    // Validación: Solo puede ver los favoritos suyos o admin
    if (user.roles !== 'admin' && user.userId !== id) {
      throw new ForbiddenException('No tienes permiso para ver los favoritos de otro usuario.');
    }
    return this.usersService.getFavorites(id, limit, page);
  }
}