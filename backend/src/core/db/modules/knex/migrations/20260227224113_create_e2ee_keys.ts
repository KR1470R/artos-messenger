import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('e2ee_keys', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().index();
    table.string('device_id', 64).notNullable().defaultTo('default');
    table.text('public_key').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

    table.unique(['user_id', 'device_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('SET FOREIGN_KEY_CHECKS=0;');
  await knex.schema.dropTableIfExists('e2ee_keys');
  await knex.raw('SET FOREIGN_KEY_CHECKS=1;');
}
