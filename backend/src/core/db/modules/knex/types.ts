import {
  ChatUserRoles,
  Users,
  Messages,
  Chats,
  ChatsUsers,
  Groups,
} from '#core/db/entities.type';

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
