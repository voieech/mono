import type { Kysely } from "kysely";

const podcastEpisodeContentSourceTableName = "podcast_episode_content_source";
const contentTypeColumnName = "content_type";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeContentSourceTableName)
    .addColumn(contentTypeColumnName, "text")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeContentSourceTableName)
    .dropColumn(contentTypeColumnName)
    .execute();
}
