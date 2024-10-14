import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { Repository } from '#common/interfaces';
import { FindManyUsersRequestDto } from './dto/requests';
import { Users } from '#core/db/entities.type';

@Injectable()
export class UsersRepository implements Repository {
  public readonly entity = 'users';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public async create(
    data: Omit<
      Pick<Users, 'name' | 'password' | 'avatar_url'>,
      'avatar_url'
    > & { avatar_url?: string },
  ) {
    return await this.db(this.entity)
      .insert(data)
      .then(([id]) => id);
  }

  public async update(
    id: number,
    data: Partial<Pick<Users, 'name' | 'password' | 'avatar_url'>>,
  ) {
    return await this.db(this.entity).where({ id }).update({
      name: data?.name,
      password: data?.password,
      avatar_url: data?.avatar_url,
    });
  }

  public async delete(id: number) {
    return await this.db(this.entity).where({ id }).delete();
  }

  public async findMany(
    filters: FindManyUsersRequestDto,
    includePassword = false,
  ) {
    const select: (keyof Users)[] = ['id', 'name', 'avatar_url'];
    if (includePassword) select.push('password');

    return await this.db(this.entity)
      .select(select)
      .where(function () {
        if (filters.username)
          this.orWhereRaw('MATCH(name) AGAINST (?)', filters.username);
      });
  }

  public async findOne(id: number, includePassword = false) {
    const select: (keyof Users)[] = [
      'id',
      'name',
      'avatar_url',
      'last_login_at',
      'created_at',
      'updated_at',
    ];
    if (includePassword) select.push('password');

    return await this.db(this.entity).select(select).where({ id }).first();
  }
}