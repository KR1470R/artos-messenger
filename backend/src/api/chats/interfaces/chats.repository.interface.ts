import { Chats } from '../chats.entity';

export default interface IChatsRepository {
  create(data: Pick<Chats, 'type'>): Promise<number>;

  delete(chatId: number): Promise<number>;

  findMany(): Promise<Pick<Chats, 'type' | 'id'>[]>;

  findOne(
    chatId: number,
  ): Promise<
    Pick<Chats, 'type' | 'id' | 'created_at' | 'updated_at'> | undefined
  >;
}
