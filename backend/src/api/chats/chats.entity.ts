import { Timestamps } from '#core/db/entities.type';
import { ChatTypesEnum } from '#core/db/types';

export class Chats extends Timestamps {
  id: number;
  type: ChatTypesEnum;
}
