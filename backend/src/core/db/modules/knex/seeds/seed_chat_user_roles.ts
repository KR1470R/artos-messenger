import { Knex } from 'knex';
import { chatUserRolesMock } from '#common/test/mock';

export async function seed(knex: Knex): Promise<void> {
  await knex('chat_user_roles').del();

  await knex('chat_user_roles').insert(chatUserRolesMock);
}
