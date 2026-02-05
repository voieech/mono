import type { Kysely } from "kysely";

import { sql } from "kysely";

const userSubscriptionsTableName = "user_subscription";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(userSubscriptionsTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("item_type", "text", (col) => col.notNull())
    .addColumn("item_id", "text", (col) => col.notNull())

    // Unique constraint that ensures
    // 1. A user can only subscribe to a specific item once, prevents duplicate
    // subscriptions.
    // 2. Creating a UNIQUE constraint automatically creates a index which in
    // this case following the DB index leftmost rule, speeds up queries for
    // things like "user's subscriptions regardless of item type" and "all of
    // user's subscriptions of item_type X"
    .addUniqueConstraint("user_subscription_unique", [
      "user_id",
      "item_type",
      "item_id",
    ])

    .execute();

  // Index to speed up queries like
  // 1. "What has this user subscribed to?"
  // 2. "Get this user's recent subscriptions"
  //
  // Notes on this index
  // 1. This is using "created_at DESC" to optimize for recent subscriptions
  // first, so that when we filter by user, the returned results are already
  // sorted by "created_at" without making the DB retrieve all subscriptions
  // before sorting in memory.
  // 2. The INCLUDE clause creates a covering index, i.e. this tells PostgreSQL
  // to "Store these extra pieces of data inside the index tree itself so you
  // don't have to look at the actual table at all." because in a "user
  // subscription" query, you usually only need the item_type and item_id to
  // render the list. If those are inside the index, you get an "Index Only
  // Scan", which is the fastest possible query in PostgreSQL since there is
  // zero table hit. The downside being the index will be slightly larger
  // because it's storing the data twice, once in the table and once in the
  // index.
  // 3. Need to use raw SQL to create a covering index with INCLUDE as kysely
  // doesnt support this natively.
  await sql`
    CREATE INDEX user_subscriptions_ordered_by_created_at_index_covering
    ON ${sql.table(userSubscriptionsTableName)}
    (user_id, created_at DESC)
    INCLUDE (item_type, item_id)
  `.execute(db);

  // Index to speed up queries like
  // 1. "How many subscriptions for this subscribeable item?"
  await db.schema
    .createIndex("user_subscriptions_for_item_index")
    .on(userSubscriptionsTableName)
    .columns(["item_type", "item_id"])
    .execute();

  // Create index to speed up queries for things like counting or listing all
  // subscribers for a specific channel.
  // await db.schema
  //   .createIndex("user_podcast_channel_sub_channel_id_user_id_idx")
  //   .on(userSubscriptionsTableName)
  //   .columns(["podcast_channel_id", "user_id"])
  //   .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // By dropping the table, all its associated data like the unique constraints
  // and indexes are also dropped
  await db.schema.dropTable(userSubscriptionsTableName).execute();
}
