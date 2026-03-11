import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PresenceGateway } from './presence.gateway';
import { PresenceController } from './presence.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'CLAVE_SECRETA_SUPER_DIFICIL',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [PresenceController],
  providers: [PresenceGateway],
  exports: [PresenceGateway],
})
export class PresenceModule {}
