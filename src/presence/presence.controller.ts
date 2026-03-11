import { Controller, Get, UseGuards } from '@nestjs/common';
import { PresenceGateway } from './presence.gateway';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceGateway: PresenceGateway) {}

  // GET /presence/online → Lista de IDs de usuarios actualmente conectados
  @UseGuards(JwtAuthGuard)
  @Get('online')
  getOnlineUsers() {
    return {
      onlineUserIds: this.presenceGateway.getOnlineUserIds(),
    };
  }
}
