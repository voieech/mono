import pc from "picocolors";

import { createDbAndMigrator } from "./createDbAndMigrator.js";

export async function printAllMigrations() {
  const { db, migrator } = await createDbAndMigrator();

  const migrations = await migrator.getMigrations();

  for (const [migrationIndex, migration] of migrations.entries()) {
    const migrationStatus =
      migration.executedAt === undefined
        ? pc.red("uncompleted")
        : pc.green("completed");

    /* eslint-disable no-console */
    console.log(`\nMigration ${migrationIndex + 1}: ${migrationStatus}`);
    console.log(`Name: ${migration.name}`);
    if (migration.executedAt !== undefined) {
      console.log(`Executed on: ${migration.executedAt}`);
    }
    console.log();
    /* eslint-enable no-console */
  }

  db.destroy();
}
