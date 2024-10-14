import { Repository } from '#common/interfaces';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class ChatUserRolesRepository implements Repository {
  public readonly entity = 'chat_user_roles';

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

  public async findMany() {
    return await this.db(this.entity).select('id', 'name');
  }

  public async findOne() {
    throw new Error('Method not implemented.');
  }
}
