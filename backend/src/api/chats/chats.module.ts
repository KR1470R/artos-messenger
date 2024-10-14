import { Module } from '@nestjs/common';
import { ChatsRepository } from './chats.repository';
import { ChatsUsersRepository } from './chats-users.repository';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsRepository, ChatsUsersRepository],
  exports: [ChatsRepository, ChatsUsersRepository],
})
export class ChatsModule {}
