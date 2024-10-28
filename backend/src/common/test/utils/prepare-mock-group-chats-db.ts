import { Knex } from 'knex';
import { groupChatMock, groupChatUsersMock, groupMock } from '../mock';

export default async function prepareMockGroupChatsDb(db: Knex) {
  await db('chats').insert(groupChatMock);
  await db('chats_users').insert(groupChatUsersMock);
  await db('groups').insert(groupMock);
}
