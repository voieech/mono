import type { Kysely } from "kysely";

import { sql } from "kysely";

const broadcastScriptChunkTableName = "broadcast_script_chunk";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(broadcastScriptChunkTableName)
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("updated_at", "timestamp", (col) => col.notNull())
    .addColumn("channel_id", "text", (col) => col.notNull())
    .addColumn("episode_id", "text", (col) => col.notNull())
    .addColumn("content_id", "text", (col) => col.notNull())
    .addColumn("story_number", "integer", (col) => col.notNull())
    .addColumn("chunk_number", "integer", (col) => col.notNull())
    .addColumn("chunk_text", "text", (col) => col.notNull())
    .addColumn("chunk_token_count", "integer", (col) => col.notNull())
    .addColumn("language", "text", (col) => col.notNull())
    .addColumn("embedding_openai_1536", sql`vector(1536)`)
    .addColumn("embedding_voyage_1024", sql`vector(1024)`)
    .addUniqueConstraint("unique_chunk_per_story", [
      "episode_id",
      "content_id",
      "story_number",
      "chunk_number",
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(broadcastScriptChunkTableName).execute();
}
