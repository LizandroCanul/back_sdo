import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // --- 1. VALIDAR CREDENCIALES ---
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    
    // Si el usuario existe y la contraseña coincide...
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user; // Quitamos el password
      return result;
    }
    return null;
  }

  // --- 2. GENERAR EL TOKEN (LOGIN) ---
  async login(user: any) {
    // Registrar última conexión
    await this.userRepository.update(user.id, { lastLogin: new Date() });

    const payload = { 
      sub: user.id,       // ID del usuario (Standard JWT)
      email: user.email, 
      roles: user.roles   // Guardamos el rol para usarlo en los Guards
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        mustChangePassword: user.mustChangePassword
      }
    };
  }
}