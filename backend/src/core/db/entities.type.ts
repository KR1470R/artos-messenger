import { ChatUserRolesEnum } from './types';

export class Timestamps {
  created_at: string;
  updated_at: string;
}

export class ChatUserRoles {
  id: ChatUserRolesEnum;
  name: string;
}

export class Users extends Timestamps {
  id: number;
  name: string;
  password: string;
  avatar_url?: string;
  last_login_at?: string;
}
