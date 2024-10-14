import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsRepository } from './groups.repository';
import { ChatsModule } from '#api/chats/chats.module';
import { GroupsChatsUsersRepository } from './groups-chats-users.repository';
import { GroupsController } from './groups.controller';

@Module({
  imports: [ChatsModule],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository, GroupsChatsUsersRepository],
  exports: [GroupsService],
})
export class GroupsModule {}