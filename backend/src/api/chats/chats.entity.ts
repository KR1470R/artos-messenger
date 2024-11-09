import { ChatTypesEnum } from '#core/db/types';

export class Chats {
  id: number;
  type: ChatTypesEnum;
  created_at: string;
  updated_at: string;
}
