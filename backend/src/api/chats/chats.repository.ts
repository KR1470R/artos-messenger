import { ChatTypesEnum } from '#core/db/types';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Chats } from './chats.entity';
import { IChatsRepository } from './interfaces';

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

  public async findMany() {
    return await this.db(this.entity)
      .select('id', 'type')
      .where({ type: ChatTypesEnum.DIRECT });
  }

  public async findOne(chatId: number) {
    return await this.db(this.entity)
      .select('id', 'type', 'created_at', 'updated_at')
      .where({ id: chatId })
      .first();
  }
}
