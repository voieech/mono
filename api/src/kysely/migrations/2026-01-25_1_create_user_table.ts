import type { Kysely } from "kysely";

const userTableName = "user";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(userTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("workos_id", "text", (col) => col.unique())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("email_verified", "boolean", (col) => col.notNull())
    .addColumn("locale", "text")
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .addColumn("profile_picture_url", "text")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(userTableName).execute();
}
