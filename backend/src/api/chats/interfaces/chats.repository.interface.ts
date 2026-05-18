import { Chats } from '../chats.entity';
import { FilterChatsQueryDto } from '../dto/requests';

export default interface IChatsRepository {
  create(data: Pick<Chats, 'type'>): Promise<number>;

  delete(chatId: number): Promise<number>;

  findMany(
    logginedUserId: number,
    relatedChatsIds: number[],
    query?: FilterChatsQueryDto,
  ): Promise<(Chats & { username: string; avatar_url: string })[]>;

  findOne(chatId: number): Promise<Chats | undefined>;
}
