import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../messages/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    _client: Socket,
    payload: {
      chatId: string;
      senderId: string;
      content: string;
    },
  ) {
    const message = await this.messageService.createMessage(payload);

    this.server.emit('message', message);
  }
}
