import type { Kysely } from "kysely";

const contentGithubRepoTableName = "content_github_repo";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentGithubRepoTableName)
    .alterColumn("readme_text", (alterColumn) => alterColumn.dropNotNull())
    .execute();
}

// ********************************* DANGEROUS *********************************
// THIS IS DANGEROUS because there might already be null columns so you cant do
// this until you have filled every single nullable column first, or drop every
// row with a null readme_text.
export async function down(db: Kysely<any>): Promise<void> {
  await db
    .updateTable(contentGithubRepoTableName)
    .set({
      readme_text: "__NULL__",
    })
    .where("readme_text", "is", null)
    .execute();

  await db.schema
    .alterTable(contentGithubRepoTableName)
    .alterColumn("readme_text", (alterColumn) => alterColumn.setNotNull())
    .execute();
}
