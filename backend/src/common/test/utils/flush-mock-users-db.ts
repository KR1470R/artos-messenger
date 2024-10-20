import { Knex } from 'knex';

export default async function flushMockUsersDb(db: Knex) {
  await db.raw('SET FOREIGN_KEY_CHECKS=0;');
  await db('users').delete();
  await db('chat_user_roles').delete();
  await db.raw('SET FOREIGN_KEY_CHECKS=1;');
}
