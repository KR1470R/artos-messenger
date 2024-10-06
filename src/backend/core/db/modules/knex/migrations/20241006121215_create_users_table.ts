import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_roles', (table) => {
    table.increments('id').notNullable().unsigned().primary();
    table.string('name', 255).notNullable();
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });

  await knex.schema
    .createTable('users', (table) => {
      table.increments('id').notNullable().unsigned().primary();
      table.string('name', 255).notNullable();
      table.string('avatar_url', 1024).notNullable();
      table.string('password', 255).notNullable();
      table
        .integer('role_id')
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('user_roles');
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
  await knex.schema.dropTableIfExists('user_roles');
  await knex.raw('SET FOREIGN_KEY_CHECKS=1;');
}
