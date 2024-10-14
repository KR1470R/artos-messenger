import { ChatTypesEnum, UserChatRolesEnum } from './types';

class Timestamps {
  created_at: string;
  updated_at: string;
}

export class ChatUserRoles {
  id: UserChatRolesEnum;
  name: string;
}

export class Users extends Timestamps {
  id: number;
  name: string;
  password: string;
  avatar_url?: string;
  last_login_at?: string;
}

export class Chats extends Timestamps {
  id: number;
  type: ChatTypesEnum;
}

export class ChatsUsers extends Timestamps {
  id: number;
  chat_id: number;
  user_id: number;
  role_id: UserChatRolesEnum;
}

export class Groups extends Timestamps {
  id: number;
  chat_id: number;
  title: string;
  description?: string;
  avatar_url?: string;
}

export class Messages extends Timestamps {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
}
