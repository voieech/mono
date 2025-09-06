import type { Kysely } from "kysely";

import { sql } from "kysely";

const contentTableName = "content";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentTableName)
    .addColumn("summary", "text")
    .addColumn("embedding_openai_1536", sql`vector(1536)`)
    .addColumn("embedding_voyage_1024", sql`vector(1024)`)
    .addColumn("embedding_update_timestamp", "timestamp")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentTableName)
    .dropColumn("summary")
    .dropColumn("embedding_openai_1536")
    .dropColumn("embedding_voyage_1024")
    .dropColumn("embedding_update_timestamp")
    .execute();
}
