import { ChatsUsers } from '#api/chats/chats-users.entity';
import { Chats } from '#api/chats/chats.entity';
import { Groups } from '#api/groups/groups.entity';
import { Messages } from '#api/messages/messages.entity';
import { ChatUserRoles, Users } from '#core/db/entities.type';

declare module 'knex/types/tables' {
  interface Tables {
    chat_user_roles: ChatUserRoles;
    users: Users;
    messages: Messages;
    chats: Chats;
    chats_users: ChatsUsers;
    groups: Groups;
  }
}
