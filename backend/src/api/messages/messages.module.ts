import { Module } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { ChatsModule } from '#api/chats/chats.module';

@Module({
  imports: [ChatsModule],
  providers: [MessagesGateway, MessagesService, MessagesRepository],
  exports: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
