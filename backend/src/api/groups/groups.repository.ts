import { Repository } from '#common/interfaces';
import { Groups } from '#core/db/entities.type';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class GroupsRepository implements Repository {
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
    id: number,
    data: Partial<Pick<Groups, 'title' | 'description' | 'avatar_url'>>,
  ) {
    return this.db(this.entity).where({ id }).update({
      title: data?.title,
      description: data?.description,
      avatar_url: data?.avatar_url,
    });
  }

  public delete(id: number) {
    return this.db(this.entity).where({ id }).delete();
  }

  public findMany(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  public async findOne() {
    throw new Error('Method not implemented.');
  }
}