import type { Kysely } from "kysely";

const podcastEpisodeTableName = "podcast_episode";
const youtube_video_count_last_updated_date_column_name =
  "youtube_video_count_last_updated_date";
const youtube_video_count_view_column_name = "youtube_video_count_view";
const youtube_video_count_like_column_name = "youtube_video_count_like";
const youtube_video_count_comment_column_name = "youtube_video_count_comment";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeTableName)
    .addColumn(
      youtube_video_count_last_updated_date_column_name,
      "timestamp",
      (col) => col.defaultTo(null),
    )
    .addColumn(youtube_video_count_view_column_name, "integer", (col) =>
      col.defaultTo(null),
    )
    .addColumn(youtube_video_count_like_column_name, "integer", (col) =>
      col.defaultTo(null),
    )
    .addColumn(youtube_video_count_comment_column_name, "integer", (col) =>
      col.defaultTo(null),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeTableName)
    .dropColumn(youtube_video_count_last_updated_date_column_name)
    .dropColumn(youtube_video_count_view_column_name)
    .dropColumn(youtube_video_count_like_column_name)
    .dropColumn(youtube_video_count_comment_column_name)
    .execute();
}
