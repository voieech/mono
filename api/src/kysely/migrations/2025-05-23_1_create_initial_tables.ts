import type { Kysely } from "kysely";

const audioTableName = "audio";
const contentTableName = "content";
const contentTagTableName = "content_tag";
const podcastChannelTableName = "podcast_channel";
const podcastEpisodeContentSourceTableName = "podcast_episode_content_source";
const podcastEpisodeExternallyHostedLinkTableName =
  "podcast_episode_externally_hosted_link";
const podcastEpisodeTableName = "podcast_episode";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(audioTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("public_url", "text", (col) => col.notNull())
    .addColumn("language", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("length", "integer", (col) => col.notNull())
    .addColumn("ai_model", "text", (col) => col.notNull())
    .addColumn("srt", "text")
    .addColumn("ssml", "text")
    .addColumn("ssml_model", "text")
    .execute();

  await db.schema
    .createTable(contentTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("original_content_publised_at", "timestamp", (col) =>
      col.notNull(),
    )
    .addColumn("domain", "text", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("language", "text", (col) => col.notNull())
    .addColumn("content_title", "text", (col) => col.notNull())
    .addColumn("content_body", "text", (col) => col.notNull())
    .addColumn("img_url", "text")
    .addColumn("rank_on_page", "integer")
    .execute();

  await db.schema
    .createTable(contentTagTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("content_id", "text", (col) => col.notNull())
    .addColumn("tag", "text", (col) => col.notNull())
    .addColumn("weight", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable(podcastChannelTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("language", "text", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("podcast_platform", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable(podcastEpisodeContentSourceTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("podcast_episode_id", "text", (col) => col.notNull())
    .addColumn("content_id", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable(podcastEpisodeExternallyHostedLinkTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("podcast_episode_id", "text", (col) => col.notNull())
    .addColumn("podcast_platform", "text", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable(podcastEpisodeTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("vanity_id", "text", (col) => col.notNull())
    .addColumn("language", "text", (col) => col.notNull())
    .addColumn("episode_number", "integer")
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("audio_id", "text", (col) => col.notNull())
    .addColumn("channel_id", "text", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(podcastEpisodeTableName).execute();
  await db.schema
    .dropTable(podcastEpisodeExternallyHostedLinkTableName)
    .execute();
  await db.schema.dropTable(podcastEpisodeContentSourceTableName).execute();
  await db.schema.dropTable(podcastChannelTableName).execute();
  await db.schema.dropTable(contentTagTableName).execute();
  await db.schema.dropTable(contentTableName).execute();
  await db.schema.dropTable(audioTableName).execute();
}
