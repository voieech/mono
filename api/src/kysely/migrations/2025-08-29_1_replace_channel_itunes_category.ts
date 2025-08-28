import type { Kysely } from "kysely";

const podcastChannelTableName = "podcast_channel";

export async function up(db: Kysely<any>): Promise<void> {
  // Because itunes support a primary and secondary category, each with their
  // own subcategories.
  await db.schema
    .alterTable(podcastChannelTableName)

    .dropColumn("category")
    .dropColumn("subcategory")

    .addColumn("category_primary", "text")
    .addColumn("subcategory_primary", "text")
    .addColumn("category_secondary", "text")
    .addColumn("subcategory_secondary", "text")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(podcastChannelTableName)

    .addColumn("category", "text", (col) => col.notNull())
    .addColumn("subcategory", "text")

    .dropColumn("category_primary")
    .dropColumn("subcategory_primary")
    .dropColumn("category_secondary")
    .dropColumn("subcategory_secondary")
    .execute();
}
