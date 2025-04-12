import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: string, content: string) {
    return this.prisma.message.create({
      data: {
        content,
        senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            color: true,
          },
        },
      },
    });
  }

  async getMessages() {
    return this.prisma.message.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            color: true,
          },
        },
      },
    });
  }
}
