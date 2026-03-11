import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  // Map: userId -> Set de socketIds (un usuario puede tener varias pestañas)
  private onlineUsers = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // --- CONEXIÓN ---
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token
        || client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: 'CLAVE_SECRETA_SUPER_DIFICIL',
      });

      const userId = payload.sub;
      client.data.userId = userId;

      // Registrar socket
      if (!this.onlineUsers.has(userId)) {
        this.onlineUsers.set(userId, new Set());
      }
      this.onlineUsers.get(userId)!.add(client.id);

      // Notificar a todos que este usuario está online
      this.server.emit('userOnline', { userId });

      // Enviar al cliente recién conectado la lista de usuarios online
      client.emit('onlineUsers', this.getOnlineUserIds());

    } catch {
      client.disconnect();
    }
  }

  // --- DESCONEXIÓN ---
  async handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (!userId) return;

    const sockets = this.onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(client.id);

      // Solo si ya no tiene ninguna pestaña abierta
      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);

        // Guardar última conexión en la DB
        await this.userRepository.update(userId, { lastLogin: new Date() });

        // Notificar a todos que se desconectó
        this.server.emit('userOffline', { userId, lastLogin: new Date() });
      }
    }
  }

  // --- HELPER: IDs de usuarios conectados ---
  getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }
}
