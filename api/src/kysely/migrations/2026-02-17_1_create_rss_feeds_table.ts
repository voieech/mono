import type { Kysely } from "kysely";

const rssFeedsTableName = "rss_feeds";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(rssFeedsTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())

    .addColumn("url", "text", (col) => col.notNull().unique())
    .addColumn("domain", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())

    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(rssFeedsTableName).execute();
}
