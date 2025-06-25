import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage({
    chatId,
    senderId,
    content,
  }: {
    chatId: string;
    senderId: string;
    content: string;
  }) {
    return this.prisma.message.create({
      data: {
        content,
        chatId,
        senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            color: true,
          },
        },
        chat: {
          select: {
            id: true,
            name: true,
            is_group: true,
          },
        },
      },
    });
  }
}
