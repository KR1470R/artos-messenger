import { AuthModule } from '#api/auth/auth.module';
import { ChatUserRolesModule } from '#api/chat-user-roles/chat-user-roles.module';
import { ChatsModule } from '#api/chats/chats.module';
import { GroupsModule } from '#api/groups/groups.module';
import { MessagesModule } from '#api/messages/messages.module';
import { UsersModule } from '#api/users/users.module';
import { AllExceptionsFilter } from '#common/filters';
import { DbModule } from '#core/db/db.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Core modules
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
    }),

    // API modules
    AuthModule,
    ChatUserRolesModule,
    ChatsModule,
    GroupsModule,
    MessagesModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
