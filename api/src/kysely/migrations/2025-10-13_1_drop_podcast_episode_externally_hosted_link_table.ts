import type { Kysely } from "kysely";

const podcastEpisodeExternallyHostedLinkTableName =
  "podcast_episode_externally_hosted_link";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropTable(podcastEpisodeExternallyHostedLinkTableName)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(podcastEpisodeExternallyHostedLinkTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("podcast_episode_id", "text", (col) => col.notNull())
    .addColumn("podcast_platform", "text", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .execute();
}
