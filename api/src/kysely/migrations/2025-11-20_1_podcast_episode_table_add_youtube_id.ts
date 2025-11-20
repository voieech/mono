import type { Kysely } from "kysely";

const podcastEpisodeTableName = "podcast_episode";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeTableName)
    .addColumn("youtube_id", "text")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeTableName)
    .dropColumn("youtube_id")
    .execute();
}
