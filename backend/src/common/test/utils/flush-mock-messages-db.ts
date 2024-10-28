import { Knex } from 'knex';

export default async function flushMockMessagesDb(db: Knex) {
  await db.raw('SET FOREIGN_KEY_CHECKS=0;');
  await db('messages').delete();
  await db.raw('SET FOREIGN_KEY_CHECKS=1;');
}
