import { Repository } from '#common/interfaces';
import { Pagination } from '#common/types';
import { getEntitiesPaginated } from '#core/db/modules/knex/utils';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Messages } from './messages.entity';

@Injectable()
export class MessagesRepository implements Repository {
  public readonly entity = 'messages';

  constructor(@InjectConnection() private readonly db: Knex) {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public create(senderId: number, data: Pick<Messages, 'chat_id' | 'content'>) {
    return new Promise((resolve, reject) => {
      this.db(this.entity)
        .insert({
          sender_id: senderId,
          ...data,
        })
        .then(([id]) => resolve(id))
        .catch(reject);
    }) as Promise<number>;
  }

  public async update(
    messageId: number,
    data: Partial<Pick<Messages, 'content' | 'is_read'>>,
  ) {
    return this.db(this.entity).where({ id: messageId }).update(data);
  }

  public delete(messageId: number) {
    return this.db(this.entity).where({ id: messageId }).delete();
  }

  public findMany(
    filters: Pick<Messages, 'chat_id'> & Pagination,
  ): Promise<Pick<Messages, 'id' | 'sender_id' | 'content' | 'is_read'>[]> {
    return getEntitiesPaginated(
      this.db(this.entity).select('id', 'sender_id', 'content').where({
        chat_id: filters.chat_id,
      }),
      filters.pageNum,
      filters.pageSize,
    );
  }

  public async findOne(messageId: number) {
    return this.db(this.entity).select('*').where({ id: messageId }).first();
  }
}
