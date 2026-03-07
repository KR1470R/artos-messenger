import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('e2ee_keys', (table) => {
    table.increments('id').notNullable().unsigned().primary();
    table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('device_id', 255).notNullable();
    // SPKI public key, base64-encoded
    table.text('public_key').notNullable();
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.unique(['user_id', 'device_id']);

    // Stores the user's PKCS8 private key encrypted with their passphrase.
    // NULL until the user sets a passphrase backup. Opaque blob to the server.
    table.text('encrypted_private_key').nullable().defaultTo(null);
    // KDF params stored alongside so we can re-derive the wrapping key on restore.
    // Format: JSON { salt: base64, iterations: number }
    table.text('kdf_params').nullable().defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('SET FOREIGN_KEY_CHECKS=0;');
  await knex.schema.dropTableIfExists('e2ee_keys');
  await knex.raw('SET FOREIGN_KEY_CHECKS=1;');
}
