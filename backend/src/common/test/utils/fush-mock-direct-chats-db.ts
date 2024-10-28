import { Knex } from 'knex';

export default async function flushMockDirectChatsDb(db: Knex) {
  await db.raw('SET FOREIGN_KEY_CHECKS=0;');
  await db('chats').delete();
  await db('chats_users').delete();
  await db.raw('SET FOREIGN_KEY_CHECKS=1;');
}
