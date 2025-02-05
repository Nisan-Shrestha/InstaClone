import { Knex } from "knex";

const TABLE_NAME = "posts";

/**

 * Create table TABLE_NAME.

 *

 * @param   {Knex} knex

 * @returns {Promise}

 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id").primary();
    table
      .uuid("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("caption");
    table.timestamp("created_at").defaultTo(knex.fn.now());
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
