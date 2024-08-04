import { Knex } from "knex";

const TABLE_NAME = "users";

/**

 * Create table TABLE_NAME.

 *

 * @param   {Knex} knex

 * @returns {Promise}

 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    table.string("username").unique().notNullable();
    table.string("name");
    table.string("email").unique().notNullable();
    table.string("password").defaultTo(null);
    table.enu("role", ["Regular", "Admin"]).defaultTo("Regular");
    table.enu("privacy", ["Private", "Public"]).defaultTo("Public");
    table.text("pfp_url");
    table.text("bio");
    table.string("phone");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
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
