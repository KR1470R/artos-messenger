import { Repository } from '#common/interfaces';
import { Messages } from '#core/db/entities.type';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class MessagesRepository implements Repository {
  public readonly entity = 'messages';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public create(data: Messages) {
    return new Promise((resolve, reject) => {
      this.db(this.entity)
        .insert(data)
        .then(([id]) => resolve(id))
        .catch(reject);
    }) as Promise<number>;
  }

  public async update(id: number, data: Messages) {
    return this.db(this.entity).where({ id }).update(data);
  }

  public delete(id: number) {
    return this.db(this.entity).where({ id }).delete();
  }

  public findMany(filters: any) {
    return this.db(this.entity).select().where(filters);
  }

  public async findOne(id: number) {
    return this.db(this.entity).where({ id }).first();
  }
}
