import { Pagination } from '#common/types';
import { Messages } from '../messages.entity';

export default interface IMessagesRepository {
  create: (
    senderId: number,
    data: Pick<Messages, 'chat_id' | 'content'>,
  ) => Promise<number>;

  update: (
    messageId: number,
    data: Partial<Pick<Messages, 'content' | 'is_read'>>,
  ) => Promise<number>;

  delete: (messageId: number) => Promise<number>;

  findMany: (
    filters: Pick<Messages, 'chat_id'> & Pagination,
  ) => Promise<Pick<Messages, 'id' | 'sender_id' | 'content' | 'is_read'>[]>;

  findOne: (messageId: number) => Promise<Messages | undefined>;
}
