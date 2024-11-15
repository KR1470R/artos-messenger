import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Groups } from './groups.entity';
import IGroupsChatsUsersRepository from './interfaces/groups-chats-users.repository.interface';

@Injectable()
export class GroupsChatsUsersRepository implements IGroupsChatsUsersRepository {
  constructor(@InjectConnection() private readonly db: Knex) {}

  public async findMany(
    logginedUserId: number,
    filters: Partial<Pick<Groups, 'title'>>,
  ) {
    return await this.db('groups')
      .select(
        'groups.id',
        'groups.title',
        'groups.avatar_url',
        'groups.chat_id',
      )
      .innerJoin('chats_users', 'groups.chat_id', 'chats_users.chat_id')
      .where('chats_users.user_id', logginedUserId)
      .andWhere(function () {
        if (filters.title)
          this.orWhereRaw('MATCH(groups.title) AGAINST (?)', filters.title);
      });
  }

  public async findOne(logginedUserId: number, groupId: number) {
    return await this.db('groups')
      .select(
        'groups.id',
        'groups.title',
        'groups.description',
        'groups.avatar_url',
        'groups.chat_id',
        'groups.created_at',
        'groups.updated_at',
      )
      .innerJoin('chats_users', 'groups.chat_id', 'chats_users.chat_id')
      .where('chats_users.user_id', logginedUserId)
      .andWhere('groups.id', groupId)
      .first();
  }
}
