import type { Kysely } from "kysely";

import fs from "fs/promises";
import { Migrator, FileMigrationProvider } from "kysely";
import path from "path";

import { createDB } from "../createDB.js";

let cached: $Nullable<{
  db: Kysely<any>;
  migrator: Migrator;
  migrationFolder: string;
}> = null;

export async function createDbAndMigrator() {
  if (cached !== null) {
    return cached;
  }

  const db = createDB({
    connectionString: process.env["DB_CONN_STRING"]!,
    kysely_log_error: true,
  });

  /** This needs to be an absolute path */
  const migrationFolder = path.join(import.meta.dirname, "../migrations");

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({ fs, path, migrationFolder }),
  });

  cached = {
    db,
    migrator,
    migrationFolder,
  };

  return cached;
}
