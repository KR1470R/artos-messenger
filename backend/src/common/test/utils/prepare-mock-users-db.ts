import { Password } from '#common/utils';
import { Knex } from 'knex';
import {
  chatUserRolesMock,
  ownerMemberMock,
  adminMemberMock,
  userMemberMock,
  bannedMemberMock,
} from '../mock';

export default async function prepareMockUsersDb(db: Knex, ownerOnly = false) {
  await db('chat_user_roles').insert(chatUserRolesMock);
  const testUsers = [adminMemberMock, userMemberMock, bannedMemberMock];

  ownerMemberMock['password'] = await Password.toHash('123');
  for (const testUser of testUsers)
    testUser['password'] = await Password.toHash('123');

  await db('users').insert(ownerMemberMock);
  if (ownerOnly) return;

  await db('users').insert(testUsers);
}
