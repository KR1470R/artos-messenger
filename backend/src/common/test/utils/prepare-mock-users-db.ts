import { Password } from '#common/utils';
import { Knex } from 'knex';
import {
  chatUserRolesMock,
  ownerMemberMock,
  adminMemberMock,
  userMemberMock,
  bannedMemberMock,
} from '../mock';

export default async function prepareMockUsersDb(db: Knex) {
  await db('chat_user_roles').insert(chatUserRolesMock);
  const testUsers = [
    ownerMemberMock,
    adminMemberMock,
    userMemberMock,
    bannedMemberMock,
  ];

  for (const testUser of testUsers)
    testUser['password'] = await Password.toHash('123');

  await db('users').insert(testUsers);
}
