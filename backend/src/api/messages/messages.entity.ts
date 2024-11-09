import { Timestamps } from '#core/db/entities.type';

export class Messages extends Timestamps {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
}
