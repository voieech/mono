import type { Kysely } from "kysely";

import { sql } from "kysely";

/**
 * Create indexes for vector similarity search.
 *
 * Not creating them concurrently to ensure that we can run the migrations
 * creating both indexes at the same time, and since our table size is
 * relatively small now and no high availability requirement.
 */

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE INDEX IF NOT EXISTS content_embedding_openai_1536_index ON content USING hnsw (embedding_openai_1536 vector_cosine_ops);`.execute(
    db,
  );
  await sql`CREATE INDEX IF NOT EXISTS content_embedding_voyage_1024_index ON content USING hnsw (embedding_voyage_1024 vector_cosine_ops);`.execute(
    db,
  );
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP INDEX IF EXISTS content_embedding_openai_1536_index;`.execute(
    db,
  );
  await sql`DROP INDEX IF EXISTS content_embedding_voyage_1024_index;`.execute(
    db,
  );
}
