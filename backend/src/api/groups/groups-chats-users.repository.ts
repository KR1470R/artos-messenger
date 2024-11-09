import { Repository } from '#common/interfaces';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { GroupFullResponseDto, GroupShortResponseDto } from './dto/responses';
import { Groups } from './groups.entity';

@Injectable()
export class GroupsChatsUsersRepository implements Repository {
  constructor(@InjectConnection() private readonly db: Knex) {}

  public async create(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  public async update(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  public async delete(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  public async findMany(
    logginedUserId: number,
    filters: Partial<Pick<Groups, 'title'>>,
  ): Promise<GroupShortResponseDto[]> {
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

  public async findOne(
    logginedUserId: number,
    groupId: number,
  ): Promise<GroupFullResponseDto | undefined> {
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
