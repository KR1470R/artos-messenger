import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersRepositoryToken } from './constants';

@Module({
  providers: [
    UsersService,
    {
      provide: UsersRepositoryToken,
      useClass: UsersRepository,
    },
  ],
  controllers: [UsersController],
  exports: [
    UsersService,
    {
      provide: UsersRepositoryToken,
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
