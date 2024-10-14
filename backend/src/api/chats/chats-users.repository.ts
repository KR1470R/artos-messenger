import { Repository } from '#common/interfaces';
import { ChatsUsers } from '#core/db/entities.type';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class ChatsUsersRepository implements Repository {
  public readonly entity = 'chats_users';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public create(
    data:
      | Pick<ChatsUsers, 'user_id' | 'chat_id' | 'role_id'>
      | Pick<ChatsUsers, 'user_id' | 'chat_id' | 'role_id'>[],
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db(this.entity)
        .insert(data)
        .then(([id]) => resolve(id))
        .catch(reject);
    }) as Promise<number>;
  }

  public async update(
    id: number,
    userId: number,
    data: Partial<Pick<ChatsUsers, 'role_id'>>,
  ) {
    await this.db(this.entity).where({ id, user_id: userId }).update({
      chat_id: data.role_id,
    });
  }

  public async delete(userId: number, chatId: number) {
    return await this.db(this.entity)
      .where({
        user_id: userId,
        chat_id: chatId,
      })
      .delete();
  }

  public async deleteMany(chatId: number) {
    return await this.db(this.entity)
      .where({
        chat_id: chatId,
      })
      .delete();
  }

  public async findMany(userId: number, chatId?: number) {
    return await this.db(this.entity).select('id', 'chat_id', 'user_id').where({
      user_id: userId,
      chat_id: chatId,
    });
  }

  public async findDirectChat(userId: number, targetUserId: number) {
    return await this.db(this.entity)
      .select('chat_id')
      .where({ user_id: userId })
      .whereIn('chat_id', (qb) => {
        qb.select('chat_id').from(this.entity).where({ user_id: targetUserId });
      })
      .first();
  }

  public async findOne(id: number) {
    return await this.db(this.entity)
      .select('id', 'chat_id', 'user_id', 'role_id', 'created_at', 'updated_at')
      .where({ id })
      .first();
  }
}
