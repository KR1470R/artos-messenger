import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Chats } from './chats.entity';
import { IChatsRepository } from './interfaces';
import { FilterChatsQueryDto } from './dto/requests';

@Injectable()
export class ChatsRepository implements IChatsRepository {
  public readonly entity = 'chats';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public async create(data: Pick<Chats, 'type'>) {
    return await this.db(this.entity)
      .insert({
        type: data.type,
      })
      .then(([id]) => id);
  }

  public async delete(chatId: number) {
    return await this.db(this.entity).where({ id: chatId }).delete();
  }

  /*
    select 
      c.id, 
      c.type, 
      u.username, 
      u.avatar_url, 
      c.created_at, 
      c.updated_at 
    from chats c 
    left join chats_users cu on c.id = cu.chat_id 
    left join users u on u.id = cu.user_id  
    where cu.user_id != 5;
  */
  public async findMany(
    logginedUserId: number,
    relatedChatsIds: number[],
    query?: FilterChatsQueryDto,
  ) {
    return (await this.db(this.entity)
      .select(
        'chats.id',
        'chats.type',
        'users.id as user_id',
        'users.username',
        'users.avatar_url',
        'chats.created_at',
        'chats.updated_at',
      )
      .leftJoin('chats_users', function () {
        this.on('chats_users.chat_id', '=', 'chats.id');
      })
      .leftJoin('users', function () {
        this.on('users.id', '=', 'chats_users.user_id');
      })
      .whereIn('chats.id', relatedChatsIds)
      .andWhere('chats_users.user_id', '!=', logginedUserId)
      .modify((qb) => {
        if (query?.type) qb.whereIn('type', query.type);
      })) as (Chats & {
      user_id: number;
      username: string;
      avatar_url: string;
    })[];
  }

  public async findOne(chatId: number) {
    return await this.db(this.entity)
      .select('id', 'type', 'created_at', 'updated_at')
      .where({ id: chatId })
      .first();
  }
}
