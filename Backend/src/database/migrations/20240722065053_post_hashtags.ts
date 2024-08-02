import { Knex } from "knex";

const TABLE_NAME = "post_hastags";

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
      .uuid("post_id")
      .unsigned()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE");
    table
      .uuid("hashtag_id")
      .unsigned()
      .references("id")
      .inTable("hashtags")
      .onDelete("CASCADE");
    table.unique(["post_id", "hashtag_id"]);
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
