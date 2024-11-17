import { FindManyUsersRequestDto } from '../dto/requests';
import { Users } from '../users.entity';

export default class IUsersRepository {
  create: (
    data: Omit<
      Pick<Users, 'username' | 'password' | 'avatar_url'>,
      'avatar_url'
    > & { avatar_url?: string },
  ) => Promise<number>;

  update: (
    userId: number,
    data: Partial<Pick<Users, 'username' | 'password' | 'avatar_url'>>,
  ) => Promise<number>;

  delete: (userId: number) => Promise<number>;

  findMany: (
    filters: FindManyUsersRequestDto,
    includePassword?: boolean,
  ) => Promise<
    (Omit<
      Pick<Users, 'id' | 'username' | 'avatar_url' | 'password'>,
      'password'
    > & {
      password?: string;
    })[]
  >;

  findOne: (
    userId: number,
    includePassword?: boolean,
  ) => Promise<Pick<Users, keyof Users> | undefined>;
}
