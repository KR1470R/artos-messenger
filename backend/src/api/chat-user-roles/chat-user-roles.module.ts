import { Module } from '@nestjs/common';
import { ChatUserRolesController } from './chat-user-roles.controller';
import { ChatUserRolesService } from './chat-user-roles.service';
import { ChatUserRolesRepository } from './chat-user-roles.repository';

@Module({
  controllers: [ChatUserRolesController],
  providers: [ChatUserRolesService, ChatUserRolesRepository],
})
export class ChatUserRolesModule {}
