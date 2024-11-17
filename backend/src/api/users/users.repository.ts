import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { FindManyUsersRequestDto } from './dto/requests';
import { Users } from './users.entity';
import IUsersRepository from './interfaces/users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  public readonly entity = 'users';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public async create(
    data: Omit<
      Pick<Users, 'username' | 'password' | 'avatar_url'>,
      'avatar_url'
    > & { avatar_url?: string },
  ) {
    return await this.db(this.entity)
      .insert(data)
      .then(([id]) => id);
  }

  public async update(
    userId: number,
    data: Partial<Pick<Users, 'username' | 'password' | 'avatar_url'>>,
  ) {
    return await this.db(this.entity).where({ id: userId }).update({
      username: data?.username,
      password: data?.password,
      avatar_url: data?.avatar_url,
    });
  }

  public async delete(userId: number) {
    return await this.db(this.entity).where({ id: userId }).delete();
  }

  public async findMany(
    filters: FindManyUsersRequestDto,
    includePassword = false,
  ) {
    const select: (keyof Users)[] = ['id', 'username', 'avatar_url'];
    if (includePassword) select.push('password');

    return await this.db(this.entity)
      .select(select)
      .where(function () {
        if (filters.username)
          this.orWhereRaw('MATCH(username) AGAINST (?)', filters.username);
      });
  }

  public async findOne(userId: number, includePassword = false) {
    const select: (keyof Users)[] = [
      'id',
      'username',
      'avatar_url',
      'last_login_at',
      'created_at',
      'updated_at',
    ];
    if (includePassword) select.push('password');

    return await this.db(this.entity)
      .select(select)
      .where({ id: userId })
      .first();
  }
}
