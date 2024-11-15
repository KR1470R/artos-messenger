import { Module } from '@nestjs/common';
import { ChatUserRolesController } from './chat-user-roles.controller';
import { ChatUserRolesService } from './chat-user-roles.service';
import { ChatUserRolesRepository } from './chat-user-roles.repository';
import { ChatUserRolesRepositoryToken } from './constants';

@Module({
  controllers: [ChatUserRolesController],
  providers: [
    ChatUserRolesService,
    {
      provide: ChatUserRolesRepositoryToken,
      useClass: ChatUserRolesRepository,
    },
  ],
})
export class ChatUserRolesModule {}
