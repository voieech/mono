import type { Kysely } from "kysely";

const podcastEpisodeContentSourceTableName = "podcast_episode_content_source";

// ********************************* DANGEROUS *********************************
// THIS IS DANGEROUS because there still be null columns/cells so you cant do
// this until you have filled every single nullable column first, or drop every
// row with a null content_type.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeContentSourceTableName)
    .alterColumn("content_type", (alterColumn) => alterColumn.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastEpisodeContentSourceTableName)
    .alterColumn("content_type", (alterColumn) => alterColumn.dropNotNull())
    .execute();
}
