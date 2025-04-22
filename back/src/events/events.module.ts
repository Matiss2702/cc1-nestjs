import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessageService } from '../messages/message.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [EventsGateway, MessageService, PrismaService],
})
export class EventsModule {}
