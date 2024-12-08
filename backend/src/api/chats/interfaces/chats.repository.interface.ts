import { Chats } from '../chats.entity';
import { FilterChatsQueryDto } from '../dto/requests';

export default interface IChatsRepository {
  create(data: Pick<Chats, 'type'>): Promise<number>;

  delete(chatId: number): Promise<number>;

  findMany(
    relatedChatsIds: number[],
    query?: FilterChatsQueryDto,
  ): Promise<Chats[]>;

  findOne(chatId: number): Promise<Chats | undefined>;
}
