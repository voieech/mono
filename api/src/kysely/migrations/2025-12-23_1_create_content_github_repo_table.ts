import type { Kysely } from "kysely";

const contentGithubRepoTableName = "content_github_repo";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(contentGithubRepoTableName)
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .addColumn("full_name", "text", (col) => col.notNull())
    .addColumn("owner", "text", (col) => col.notNull())
    .addColumn("repo_name", "text", (col) => col.notNull())
    .addColumn("repo_url", "text", (col) => col.notNull())
    .addColumn("language", "text", (col) => col.notNull())
    .addColumn("stars", "integer", (col) => col.notNull())
    .addColumn("stars_today", "integer", (col) => col.notNull())
    .addColumn("forks", "integer", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("readme_text", "text", (col) => col.notNull())
    .addColumn("readme_status", "text", (col) => col.notNull())
    .addColumn("trending_date", "timestamp", (col) => col.notNull())
    .addColumn("readme_language", "text", (col) => col.notNull())
    .addColumn("trending_since", "text", (col) => col.notNull())
    .addColumn("crawled_at", "timestamp", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(contentGithubRepoTableName).execute();
}
