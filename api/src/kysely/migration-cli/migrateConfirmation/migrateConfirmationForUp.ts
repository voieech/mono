import type { MigrationInfo } from "kysely";

import { logger } from "../../../logger.js";

export function migrateConfirmationForUp(
  migrations: ReadonlyArray<MigrationInfo>,
) {
  const nextUnexecutedMigration = migrations
    .filter((migration) => migration.executedAt === undefined)
    .at(0);

  if (nextUnexecutedMigration === undefined) {
    logger.info(
      migrateConfirmationForUp.name,
      "There is no unexecuted Migration left to migrate up.",
    );
    return false;
  }

  logger.info(
    migrateConfirmationForUp.name,
    `Migration to migrate up: ${nextUnexecutedMigration.name}`,
  );

  return true;
}
