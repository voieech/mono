import type { Kysely } from "kysely";

import { sql } from "kysely";

const contentRssArticleTableName = "content_rss_article";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(contentRssArticleTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())

    .addColumn("feed_id", "text", (col) => col.notNull())
    .addColumn("article_url", "text", (col) => col.notNull().unique())
    .addColumn("article_title", "text", (col) => col.notNull())
    .addColumn("article_body", "text", (col) => col.notNull())
    .addColumn("article_body_word_count", "integer", (col) => col.notNull())
    .addColumn("article_author", "text")

    .addColumn("published_at", "timestamp")
    .addColumn("img_url", "text")
    .addColumn("summary", "text")
    .addColumn("embedding_openai_1536", sql`vector(1536)`)
    .addColumn("embedding_voyage_1024", sql`vector(1024)`)
    .addColumn("embedding_update_timestamp", "timestamp")

    .addColumn("rating", "json")

    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(contentRssArticleTableName).execute();
}
