import {
  UserRoles,
  Users,
  Messages,
  Chats,
  ChatsUsers,
  Groups,
} from '#core/db/entities.type';

declare module 'knex/types/tables' {
  interface Tables {
    user_roles: UserRoles;
    users: Users;
    messages: Messages;
    chats: Chats;
    chats_users: ChatsUsers;
    groups: Groups;
  }
}
