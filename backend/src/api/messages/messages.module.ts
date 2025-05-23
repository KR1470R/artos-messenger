import { Module } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { ChatsModule } from '#api/chats/chats.module';
import { JwtWsStrategy } from '#api/auth/strategies';
import { MessagesRepositoryToken } from './constants';
import { UsersModule } from '#api/users/users.module';
import { JwtAuthWsGuard } from '#api/auth/guards';

@Module({
  imports: [ChatsModule, UsersModule],
  providers: [
    MessagesGateway,
    MessagesService,
    JwtWsStrategy,
    JwtAuthWsGuard,
    {
      provide: MessagesRepositoryToken,
      useClass: MessagesRepository,
    },
  ],
})
export class MessagesModule {}
