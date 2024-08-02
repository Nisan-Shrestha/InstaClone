import { Knex } from "knex";

const TABLE_NAME = "hashtags";

/**

 * Create table TABLE_NAME.

 *

 * @param   {Knex} knex

 * @returns {Promise}

 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').primary();
    table.string('name').unique().notNullable();
  });
}

/**

 * Drop table TABLE_NAME.

 *

 * @param   {Knex} knex

 * @returns {Promise}

 */

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
