import type { Kysely } from "kysely";

const contentGithubRepoTableName = "content_github_repo";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentGithubRepoTableName)
    .dropColumn("owner")
    .dropColumn("repo_name")
    .execute();
}

// ********************************* DANGEROUS *********************************
// THIS IS DANGEROUS because you cant add a non null column into a table when
// there are rows already since the default value is null. So this adds in a
// default `_NULL_` string value as placeholder for you to backfill and fix
// later on after this step completes.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentGithubRepoTableName)
    // Non null columns since it follows the original table design, see previous
    // migration script that created the table.
    .addColumn("owner", "text", (col) => col.notNull().defaultTo("__NULL__"))
    // Non null columns since it follows the original table design, see previous
    // migration script that created the table.
    .addColumn("repo_name", "text", (col) =>
      col.notNull().defaultTo("__NULL__"),
    )
    .execute();
}
