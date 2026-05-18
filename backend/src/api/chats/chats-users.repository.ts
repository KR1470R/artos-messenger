import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { ChatsUsers } from './chats-users.entity';
import { IChatsUsersRepository } from './interfaces';

@Injectable()
export class ChatsUsersRepository implements IChatsUsersRepository {
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
    chatId: number,
    userId: number,
    data: Partial<Pick<ChatsUsers, 'role_id'>>,
  ) {
    return await this.db(this.entity)
      .update({
        role_id: data.role_id,
      })
      .where({ chat_id: chatId, user_id: userId });
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
    await this.db(this.entity)
      .where({
        chat_id: chatId,
      })
      .delete();
  }

  // Returns rows for the given userId (optionally filtered to one chat).
  // Used for membership checks and listing a user's own chats.
  public async findMany(userId: number, chatId?: number) {
    return await this.db(this.entity)
      .select('id', 'chat_id', 'user_id', 'role_id', 'created_at', 'updated_at')
      .where({
        user_id: userId,
      })
      .modify((qb) => {
        if (chatId) qb.where({ chat_id: chatId });
      });
  }

  // Returns ALL member rows for a given chat — no user_id filter.
  public async findManyByChatId(chatId: number) {
    return await this.db(this.entity)
      .select(
        'chats_users.id',
        'chats_users.chat_id',
        'chats_users.user_id',
        'users.username',
        'chats_users.role_id',
        'chats_users.created_at',
        'chats_users.updated_at',
      )
      .leftJoin('users', function () {
        this.on('users.id', '=', 'chats_users.user_id');
      })
      .where({ chat_id: chatId });
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

  public async findOne(userId: number, chatId: number) {
    return await this.db(this.entity)
      .select('id', 'chat_id', 'user_id', 'role_id', 'created_at', 'updated_at')
      .where({
        user_id: userId,
        chat_id: chatId,
      })
      .first();
  }
}
