import type { MigrationInfo } from "kysely";

import readline from "node:readline";

import { logger } from "../../logger.js";
import { createDbAndMigrator } from "./createDbAndMigrator.js";

export async function confirmMigrationWithUser(
  migrateConfirmationFunction: (
    migrations: ReadonlyArray<MigrationInfo>,
  ) => boolean | Promise<boolean>,
) {
  const { db, migrator } = await createDbAndMigrator();
  const migrations = await migrator.getMigrations();

  const shouldContinue = await migrateConfirmationFunction(migrations);
  if (!shouldContinue) {
    // Destroy DB connection so that the CLI program can exit.
    await db.destroy();
    return false;
  }

  const isKyeselyMigrationRanInCI = process.argv.includes("--ci");
  if (isKyeselyMigrationRanInCI) {
    logger.info(
      confirmMigrationWithUser.name,
      "Skipping confirmation validation in CI environment...",
    );
    return true;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve: (answer: string) => void) =>
    rl.question("Confirm migration? [y/n]: ", resolve),
  );

  rl.close();

  if (answer === "y") {
    logger.info(confirmMigrationWithUser.name, "Thank you for confirming...");
    return true;
  }

  logger.info(confirmMigrationWithUser.name, "Aborting...");

  // Destroy DB connection so that the CLI program can exit.
  await db.destroy();

  return false;
}
