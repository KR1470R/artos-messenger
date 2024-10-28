import { Knex } from 'knex';
import { directChatMock, directChatUsersMock } from '../mock/direct-chat.mock';

export default async function prepareMockDirectChatsDb(db: Knex) {
  await db('chats').insert(directChatMock);
  await db('chats_users').insert(directChatUsersMock);
}
