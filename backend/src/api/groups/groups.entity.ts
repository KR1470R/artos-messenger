import { Timestamps } from '../../core/db/entities.type';

export class Groups extends Timestamps {
  id: number;
  chat_id: number;
  title: string;
  description?: string;
  avatar_url?: string;
}
