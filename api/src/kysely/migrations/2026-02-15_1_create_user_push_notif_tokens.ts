import type { Kysely } from "kysely";

const userPushNotifTokensTableName = "user_push_notif_tokens";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(userPushNotifTokensTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("updated_at", "timestamp", (col) => col.notNull())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("expo_token", "text", (col) => col.notNull().unique())
    .addColumn("device_token", "text")
    .addColumn("device_platform", "text")
    .execute();

  // This speeds up queries that are looking up all push notification tokens of
  // a specific user without doing a slow full-table scan.
  await db.schema
    .createIndex(`${userPushNotifTokensTableName}_user_id_index`)
    .on(userPushNotifTokensTableName)
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(userPushNotifTokensTableName).execute();
}
