import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Importamos el servicio de usuarios
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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