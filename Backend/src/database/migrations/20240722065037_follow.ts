import { Knex } from "knex";

const TABLE_NAME = "follow";

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
      .uuid("follower_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("following_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["follower_id", "following_id"]);
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
