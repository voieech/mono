import type { Kysely } from "kysely";

const userSubscriptionToPodcastChannelTableName =
  "user_subscription_to_podcast_channel";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(userSubscriptionToPodcastChannelTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("podcast_channel_id", "text", (col) => col.notNull())

    // A user can only subscribe to a podcast channel once.
    // By creating a UNIQUE constraint, it also automatically creates a
    // (user_id, podcast_channel_id) index to speed up queries the check if a
    // user is subscribed to a specific channel, getting all subscriptions of a
    // specific user, etc...
    .addUniqueConstraint("user_podcast_channel_sub_unique", [
      "user_id",
      "podcast_channel_id",
    ])
    .execute();

  // Create index to speed up queries for things like counting or listing all
  // subscribers for a specific channel.
  await db.schema
    .createIndex("user_podcast_channel_sub_channel_id_user_id_idx")
    .on(userSubscriptionToPodcastChannelTableName)
    .columns(["podcast_channel_id", "user_id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // By dropping the table, all its associated data like the unique constraints
  // and indexes are also dropped
  await db.schema
    .dropTable(userSubscriptionToPodcastChannelTableName)
    .execute();
}
