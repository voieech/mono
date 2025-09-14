import type { Kysely } from "kysely";

const podcastEpisodeTableName = "podcast_episode";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeTableName)
    .addUniqueConstraint("unique_vanity_id", ["vanity_id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeTableName)
    .dropConstraint("unique_vanity_id")
    .execute();
}
