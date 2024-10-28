import { Knex } from 'knex';

export default async function flushMockGroupChatsDb(db: Knex) {
  await db.raw('SET FOREIGN_KEY_CHECKS=0;');
  await db('chats').delete();
  await db('chats_users').delete();
  await db('groups').delete();
  await db.raw('SET FOREIGN_KEY_CHECKS=1;');
}
