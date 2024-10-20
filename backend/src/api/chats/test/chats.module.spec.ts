import {
  createBaseTestingModule,
  flushMockUsersDb,
  prepareMockUsersDb,
} from '#common/test/utils';
import { Knex } from 'knex';
import { ChatsService } from '../chats.service';
import { ChatsRepository } from '../chats.repository';
import { ChatsController } from '../chats.controller';
import {
  adminMemberMock,
  ownerMemberMock,
  userMemberMock,
} from '#common/test/mock';
import { ChatMember } from '#core/db/types';
import { ChatsUsersRepository } from '../chats-users.repository';

let chatsController: ChatsController;
let db: Knex;

const chatPayload = {};

const testCreate = async (user1: ChatMember, user2: ChatMember) => {
  const result = await chatsController.create(user1.id, user2.id);
  expect(result.id).toBeDefined();
  expect(result.message).toEqual('Chat created successfully.');

  chatPayload['id'] = result.id;
};
const testDelete = async (user: ChatMember, chatId: number) => {
  await chatsController.delete(user.id, chatId);
};
const testDeleteNotFound = async (user: ChatMember, chatId: number) => {
  await expect(chatsController.delete(user.id, chatId)).rejects.toThrow();
};

beforeAll(async () => {
  const testModule = await createBaseTestingModule({
    controllers: [ChatsController],
    providers: [ChatsService, ChatsRepository, ChatsUsersRepository],
  });

  chatsController = testModule.get<ChatsController>(ChatsController);
  db = testModule.get<Knex>('default');

  await flushMockUsersDb(db);
  await prepareMockUsersDb(db);
});

afterAll(async () => {
  await flushMockUsersDb(db);
  await db.destroy();
});

describe('ChatsModule', () => {
  it('user should be able to create chat', async () => {
    await testCreate(ownerMemberMock, adminMemberMock);
  });

  it('user cannot delete chat in which he is not a member', async () => {
    await testDeleteNotFound(userMemberMock, chatPayload['id']);
  });

  it('user should be able to delete chat', async () => {
    await testDelete(ownerMemberMock, chatPayload['id']);
  });
});
