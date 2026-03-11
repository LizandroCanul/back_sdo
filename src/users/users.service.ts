import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserFavoriteObra } from './entities/user-favorite-obra.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserFavoriteObra)
    private readonly userFavoriteObraRepository: Repository<UserFavoriteObra>,
  ) {}

  // --- CREAR (Encripta password) ---
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), // Encriptamos aquí
        mustChangePassword: true
      });

      await this.userRepository.save(user);
      delete (user as any).password;
      return user;

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // --- LEER TODOS ---
  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'email', 'nombreCompleto', 'roles', 'isActive', 'mustChangePassword', 'lastLogin']
    });
  }

  // --- LEER UNO ---
  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // --- BUSCAR POR EMAIL (Para Auth - Incluye Password) ---
  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nombreCompleto', 'roles', 'isActive', 'mustChangePassword'],
    });
  }

  // --- ACTUALIZAR (Re-encripta si cambia password) ---
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    });

    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);

    if (updateUserDto.password) {
      user.password = bcrypt.hashSync(updateUserDto.password, 10);
      user.mustChangePassword = false; // Ya la cambió, quitamos la obligación
    }

    try {
      await this.userRepository.save(user);
      delete (user as any).password;
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // --- ELIMINAR ---
  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: `Usuario eliminado correctamente` };
  }

  // --- MANAGING OBRAS FAVORITAS ---

  // Agregar una obra a favoritas
  async addFavorite(userId: string, obraId: number) {
    // Verificar que el usuario existe
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Verificar si ya existe en favoritas
    const existe = await this.userFavoriteObraRepository.findOne({
      where: { userId, obraId }
    });
    
    if (existe) {
      throw new BadRequestException('Esta obra ya está en tus favoritas');
    }

    // Crear el registro
    const favorita = this.userFavoriteObraRepository.create({
      userId,
      obraId
    });

    return await this.userFavoriteObraRepository.save(favorita);
  }

  // Remover una obra de favoritas
  async removeFavorite(userId: string, obraId: number) {
    const result = await this.userFavoriteObraRepository.delete({
      userId,
      obraId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Esta obra no está en tus favoritas');
    }

    return { message: 'Obra removida de favoritas' };
  }

  // Obtener todas las obras favoritas de un usuario
  async getFavorites(userId: string, limit = 10, page = 1) {
    // Verificar que el usuario existe
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const skip = (page - 1) * limit;

    const [favoritas, total] = await this.userFavoriteObraRepository.findAndCount({
      where: { userId },
      relations: ['obra', 'obra.municipio', 'obra.dependencia', 'obra.ejercicioFiscal', 'obra.estatusObra', 'obra.tipoProyecto'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      data: favoritas.map(fav => fav.obra),
      meta: {
        totalItems: total,
        itemCount: favoritas.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }
    };
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') { 
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }
    console.log(error);
    throw new InternalServerErrorException('Error en el servidor, revisar logs.');
  }
}