import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('users', (table) => {
      table.increments('id').notNullable().unsigned().primary();
      table.string('name', 255).notNullable();
      table.string('password', 255).notNullable();
      table.string('avatar_url', 1024).nullable();
      table
        .dateTime('last_login_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .dateTime('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
    .raw(
      'ALTER TABLE `users` ADD FULLTEXT INDEX `users_name_text_index` (`name`) WITH PARSER `ngram`',
    );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('SET FOREIGN_KEY_CHECKS=0;');
  await knex.schema.dropTableIfExists('users');
  await knex.raw('SET FOREIGN_KEY_CHECKS=1;');
}
