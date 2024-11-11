import { Module } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { ChatsModule } from '#api/chats/chats.module';
import { JwtWsStrategy } from '#api/auth/strategies';
import { UsersModule } from '#api/users/users.module';

@Module({
  imports: [ChatsModule, UsersModule],
  providers: [
    MessagesGateway,
    MessagesService,
    MessagesRepository,
    JwtWsStrategy,
  ],
  exports: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
