import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsRepository } from './groups.repository';
import { ChatsModule } from '#api/chats/chats.module';
import { GroupsChatsUsersRepository } from './groups-chats-users.repository';
import { GroupsController } from './groups.controller';
import { UsersModule } from '#api/users/users.module';
import {
  GroupsChatsUsersRepositoryToken,
  GroupsRepositoryToken,
} from './constants';

@Module({
  imports: [ChatsModule, UsersModule],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    {
      provide: GroupsRepositoryToken,
      useClass: GroupsRepository,
    },
    {
      provide: GroupsChatsUsersRepositoryToken,
      useClass: GroupsChatsUsersRepository,
    },
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
