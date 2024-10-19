import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  CreateUserRequestDto,
  FindManyUsersRequestDto,
  UpdateUserRequestDto,
} from './dto/requests';
import { FindManyUsersResponseDto, UserFullResponseDto } from './dto/responses';
import { Password } from '#common/utils';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async processCreate(data: CreateUserRequestDto) {
    const existentUser = await this.usersRepository.findMany({
      username: data.name,
    });
    if (existentUser.length)
      throw new ForbiddenException('User with such username already exists.');

    data.password = await Password.toHash(data.password);
    return this.usersRepository.create(data);
  }

  public async processUpdate(
    logginedUserId: number,
    data: UpdateUserRequestDto,
  ) {
    const target = await this.usersRepository.findOne(logginedUserId, true);
    if (!target) throw new NotFoundException('User not found.');
    if (data.password) {
      if (!data.old_password) throw new Error('Old password is required.');
      const passwordsMatched = await Password.compare(
        target!.password,
        data.old_password,
      );
      if (!passwordsMatched)
        throw new ForbiddenException('Passwords are not matched.');
      data.password = await Password.toHash(data.password);
    }
    return this.usersRepository.update(logginedUserId, data);
  }

  public async processDelete(id: number) {
    await this.processFindOne(id);
    return await this.usersRepository.delete(id);
  }

  public async processFindMany(
    filters: FindManyUsersRequestDto,
  ): Promise<FindManyUsersResponseDto> {
    const data = await this.usersRepository.findMany(filters, false);

    return { data } as FindManyUsersResponseDto;
  }

  public async processFindOne(id: number): Promise<UserFullResponseDto> {
    const target = (await this.usersRepository.findOne(
      id,
    )) as UserFullResponseDto;
    if (!target) throw new NotFoundException('User not found.');

    return target;
  }
}
