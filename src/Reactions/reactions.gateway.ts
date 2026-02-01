import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ReactionsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userIdRaw = client.handshake.query.userId;

    if (!userIdRaw) {
      client.disconnect();
      return;
    }

    const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw;

    void client.join(`user-${userId}`);
  }

  sendReaction(data: any) {
    // بث لكل المستخدمين 🔥
    this.server.emit('reactionUpdate', data);
  }
}
