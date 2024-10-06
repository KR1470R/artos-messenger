import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('chats', (table) => {
    table.increments('id').notNullable().unsigned().primary();
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
  await knex.schema.createTable('messages', (table) => {
    table.increments('id').notNullable().unsigned().primary();
    table
      .integer('chat_id')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('chats');
    table
      .integer('sender_id')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('users');
    table.text('content').notNullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
  await knex.schema.createTable('chats_users', (table) => {
    table
      .integer('chat_id')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('chats')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
  await knex.schema.createTable('groups', (table) => {
    table.increments('id').notNullable().unsigned().primary();
    table.string('title', 255).notNullable();
    table.string('description', 255).notNullable();
    table
      .integer('chat_id')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('chats');
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
  await knex.schema.createTable('groups_users', (table) => {
    table
      .integer('group_id')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('groups');
    table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('users');
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
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('SET FOREIGN_KEY_CHECKS=0;');
  await knex.schema.dropTableIfExists('chats');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('chats_users');
  await knex.schema.dropTableIfExists('groups');
  await knex.schema.dropTableIfExists('groups_users');
  await knex.raw('SET FOREIGN_KEY_CHECKS=1;');
}
