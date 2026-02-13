import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lee el token del Header "Authorization: Bearer ..."
      ignoreExpiration: false, // Si el token expiró, no lo deja pasar
      secretOrKey: 'CLAVE_SECRETA_SUPER_DIFICIL', // Debe coincidir con la del Module
    });
  }

  // Si el token es válido, Nest ejecuta esto y mete el usuario en la Request
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}