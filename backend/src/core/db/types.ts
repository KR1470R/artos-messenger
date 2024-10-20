import { Users } from './entities.type';

enum ChatUserRolesEnum {
  OWNER = 1,
  ADMIN = 2,
  USER = 3,
  BANNED = 4,
}

enum ChatTypesEnum {
  DIRECT = 1,
  GROUP = 2,
}

type ChatMember = Pick<Users, 'id' | 'name'>;

export { ChatUserRolesEnum, ChatTypesEnum, ChatMember };
