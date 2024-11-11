import { Pagination } from '#common/types';
import { getEntitiesPaginated } from '#core/db/modules/knex/utils';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Messages } from './messages.entity';
import { IMessagesRepository } from './interfaces';

@Injectable()
export class MessagesRepository implements IMessagesRepository {
  public readonly entity = 'messages';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public async create(
    senderId: number,
    data: Pick<Messages, 'chat_id' | 'content'>,
  ) {
    return await this.db(this.entity)
      .insert({
        sender_id: senderId,
        ...data,
      })
      .then(([id]) => id);
  }

  public async update(
    messageId: number,
    data: Partial<Pick<Messages, 'content' | 'is_read'>>,
  ) {
    return await this.db(this.entity).where({ id: messageId }).update(data);
  }

  public async delete(messageId: number) {
    return await this.db(this.entity).where({ id: messageId }).delete();
  }

  public async findMany(filters: Pick<Messages, 'chat_id'> & Pagination) {
    return await getEntitiesPaginated(
      this.db(this.entity).select('id', 'sender_id', 'content').where({
        chat_id: filters.chat_id,
      }),
      filters.pageNum,
      filters.pageSize,
    );
  }

  public async findOne(messageId: number) {
    return await this.db(this.entity)
      .select('*')
      .where({ id: messageId })
      .first();
  }
}
