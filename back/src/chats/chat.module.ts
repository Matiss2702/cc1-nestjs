import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma.service';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
})
export class ChatModule {}
