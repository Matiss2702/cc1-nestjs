import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Param } from '@nestjs/common';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async findUserChats(@Req() req) {
    const userId = req.user.sub;
    return this.chatService.getUserChats(userId);
  }

  @Get(':id')
  async findChatById(@Req() req, @Param('id') chatId: string) {
    const userId = req.user.sub;
    return this.chatService.getChatById(userId, chatId);
  }
}
