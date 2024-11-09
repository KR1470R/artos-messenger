import { Timestamps } from '#core/db/entities.type';
import { ChatUserRolesEnum } from '#core/db/types';

export class ChatsUsers extends Timestamps {
  id: number;
  chat_id: number;
  user_id: number;
  role_id: ChatUserRolesEnum;
}
