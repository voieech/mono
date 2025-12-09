import type { Kysely } from "kysely";

const contentYoutubeVideoTableName = "content_youtube_video";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(contentYoutubeVideoTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("original_content_publised_at", "timestamp", (col) =>
      col.notNull(),
    )
    .addColumn("channel_id", "text", (col) => col.notNull())
    .addColumn("channel_title", "text", (col) => col.notNull())
    .addColumn("video_id", "text", (col) => col.notNull())
    .addColumn("video_title", "text", (col) => col.notNull())
    .addColumn("duration", "integer")
    .addColumn("view_count", "integer")
    .addColumn("like_count", "integer")
    .addColumn("comment_count", "integer")
    .addColumn("stats_fetched_at", "timestamp")
    .addColumn("classification", "text")
    .addColumn("confidence", "text")
    .addColumn("has_subtitles", "boolean")
    .addColumn("transcript_method", "text")
    .addColumn("transcript_status", "text", (col) => col.notNull())
    .addColumn("transcript_error_message", "text")
    .addColumn("transcript_duration", "integer")
    .addColumn("transcript_text", "text")
    .addColumn("snippet_count", "integer")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(contentYoutubeVideoTableName).execute();
}
