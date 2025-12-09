import type { Kysely } from "kysely";

const contentTweetTableName = "content_tweet";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(contentTweetTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("published_at", "timestamp", (col) => col.notNull())
    .addColumn("tweet_id", "text", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("author_name", "text", (col) => col.notNull())
    .addColumn("author_username", "text", (col) => col.notNull())
    .addColumn("text", "text", (col) => col.notNull())
    .addColumn("view_count", "integer", (col) => col.notNull())
    .addColumn("like_count", "integer", (col) => col.notNull())
    .addColumn("retweet_count", "integer", (col) => col.notNull())
    .addColumn("reply_count", "integer", (col) => col.notNull())
    .addColumn("language", "text", (col) => col.notNull())
    .addColumn("category", "text", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(contentTweetTableName).execute();
}
