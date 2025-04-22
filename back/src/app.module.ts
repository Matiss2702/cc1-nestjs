import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chats/chat.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [AuthModule, UsersModule, ChatModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
