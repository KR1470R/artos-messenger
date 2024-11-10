import { ChatsUsers } from '#api/chats/chats-users.entity';
import { Chats } from '#api/chats/chats.entity';
import { Groups } from '#api/groups/groups.entity';
import { Messages } from '#api/messages/messages.entity';
import { Users } from '#api/users/users.entity';
import { ChatUserRoles } from '#common/test/mock/chat-user-roles.entity';

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
