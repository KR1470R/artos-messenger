import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Groups } from './groups.entity';
import IGroupsRepository from './interfaces/groups.repository.interface';

@Injectable()
export class GroupsRepository implements IGroupsRepository {
  public readonly entity = 'groups';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public async create(
    data: Pick<Groups, 'title' | 'description' | 'avatar_url' | 'chat_id'>,
  ) {
    return await this.db(this.entity)
      .insert({
        title: data.title,
        description: data.description,
        avatar_url: data.avatar_url,
        chat_id: data.chat_id,
      })
      .then(([id]) => id);
  }

  public async update(
    groupId: number,
    data: Partial<Pick<Groups, 'title' | 'description' | 'avatar_url'>>,
  ) {
    return this.db(this.entity).where({ id: groupId }).update({
      title: data?.title,
      description: data?.description,
      avatar_url: data?.avatar_url,
    });
  }

  public async delete(groupId: number) {
    return await this.db(this.entity).where({ id: groupId }).delete();
  }
}
