import { Module } from '@nestjs/common';
import { ChatsRepository } from './chats.repository';
import { ChatsUsersRepository } from './chats-users.repository';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsRepositoryToken, ChatsUsersRepositoryToken } from './constants';

const repositoriesProviders = [
  {
    provide: ChatsRepositoryToken,
    useClass: ChatsRepository,
  },
  {
    provide: ChatsUsersRepositoryToken,
    useClass: ChatsUsersRepository,
  },
];

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ...repositoriesProviders],
  exports: repositoriesProviders,
})
export class ChatsModule {}
