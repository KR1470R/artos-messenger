import { createBaseTestingModule, flushMockUsersDb } from '#common/test/utils';
import { Knex } from 'knex';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { UsersController } from '../users.controller';
import { ownerMemberMock } from '#common/test/mock';
import { UsersRepositoryToken } from '../constants';

let usersController: UsersController;
let db: Knex;

const userPayload = {
  ...ownerMemberMock,
  password: '123',
};

beforeAll(async () => {
  const testModule = await createBaseTestingModule({
    controllers: [UsersController],
    providers: [
      UsersService,
      {
        provide: UsersRepositoryToken,
        useClass: UsersRepository,
      },
    ],
  });

  usersController = testModule.get<UsersController>(UsersController);
  db = testModule.get<Knex>('default');

  await flushMockUsersDb(db);
});

afterAll(async () => {
  await db.destroy();
});

describe('UsersModule', () => {
  it('users should be able to register account', async () => {
    const result = await usersController.create(userPayload);
    expect(result.id).toBeDefined();
    expect(result.message).toEqual('User created successfully.');

    userPayload['id'] = result.id;
  });

  it('users should be able to update account', async () => {
    const newUsername = 'newname';
    const result = await usersController.update(userPayload.id, {
      name: newUsername,
    });
    expect(result.message).toEqual('User updated successfully.');

    const updatedUser = await usersController.findOne(userPayload.id);
    expect(updatedUser.name).toEqual(newUsername);

    userPayload.name = newUsername;
  });

  it('users should be able to get all users', async () => {
    const result = await usersController.findMany({
      username: userPayload.name,
    });

    expect(result.data.length).toBeGreaterThan(0);
  });

  it('users should be able to get one user', async () => {
    const result = await usersController.findOne(userPayload.id);

    expect(result.name).toEqual(userPayload.name);
  });

  it('users should be able to delete account', async () => {
    const result = await usersController.delete(userPayload.id);

    expect(result.message).toEqual('User deleted successfully.');

    const foundResult = await usersController.findMany({
      username: userPayload.name,
    });

    expect(foundResult.data.length).toEqual(0);
  });
});
