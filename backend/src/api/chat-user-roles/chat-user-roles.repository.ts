import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { IChatUserRolesRepository } from './interfaces';

@Injectable()
export class ChatUserRolesRepository implements IChatUserRolesRepository {
  public readonly entity = 'chat_user_roles';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public async findMany() {
    return await this.db(this.entity).select('id', 'name');
  }
}
