import type { Kysely } from "kysely";

const broadcastScriptChunkTableName = "broadcast_script_chunk";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(broadcastScriptChunkTableName)
    .alterColumn("content_id", (alterColumn) => alterColumn.dropNotNull())
    .execute();
}

// ********************************* DANGEROUS *********************************
// THIS IS DANGEROUS because there might already be null columns so you cant do
// this until you have filled every single nullable column first, or drop every
// row with a null content_id.
export async function down(db: Kysely<any>): Promise<void> {
  await db
    .updateTable(broadcastScriptChunkTableName)
    .set({
      content_id: "__NULL__",
    })
    .where("content_id", "is", null)
    .execute();

  await db.schema
    .alterTable(broadcastScriptChunkTableName)
    .alterColumn("content_id", (alterColumn) => alterColumn.setNotNull())
    .execute();
}
