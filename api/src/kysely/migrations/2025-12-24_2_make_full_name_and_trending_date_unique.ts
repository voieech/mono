import type { Kysely } from "kysely";

const contentGithubRepoTableName = "content_github_repo";
const constraintName = "content_github_repo_full_name_trending_date";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentGithubRepoTableName)
    .addUniqueConstraint(constraintName, ["full_name", "trending_date"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentGithubRepoTableName)
    .dropConstraint(constraintName)
    .execute();
}
