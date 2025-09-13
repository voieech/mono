import type { Kysely } from "kysely";

import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS btree_gin;`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP EXTENSION IF EXISTS btree_gin;`.execute(db);
}
