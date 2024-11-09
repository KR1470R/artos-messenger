import { ChatUserRolesEnum } from '#core/db/types';

export class ChatsUsers {
  id: number;
  chat_id: number;
  user_id: number;
  role_id: ChatUserRolesEnum;
  created_at: string;
  updated_at: string;
}
