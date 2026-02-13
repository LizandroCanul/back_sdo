import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // <--- Importamos UsersModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // <--- Registramos la estrategia

@Module({
  imports: [
    UsersModule, // Necesario para buscar usuarios en la DB
    PassportModule,
    JwtModule.register({
      secret: 'CLAVE_SECRETA_SUPER_DIFICIL', // EN PRODUCCIÓN USAR .ENV
      signOptions: { expiresIn: '8h' }, // El token expira en 8 horas
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <--- Proveemos el servicio y la estrategia
  exports: [AuthService, JwtStrategy, PassportModule]
})
export class AuthModule {}