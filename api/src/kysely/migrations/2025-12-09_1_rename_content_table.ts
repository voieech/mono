import type { Kysely } from "kysely";

const contentTableName = "content";
const contentNewsArticleTableName = "content_news_article";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentTableName)
    .renameTo(contentNewsArticleTableName)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(contentNewsArticleTableName)
    .renameTo(contentTableName)
    .execute();
}
