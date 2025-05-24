import type { MigrationInfo } from "kysely";

import { logger } from "../../../logger.js";

export function migrateConfirmationForDown(
  migrations: ReadonlyArray<MigrationInfo>,
) {
  const lastExecutedMigration = migrations
    .filter((migration) => migration.executedAt !== undefined)
    .at(-1);

  if (lastExecutedMigration === undefined) {
    logger.info(
      migrateConfirmationForDown.name,
      "There is no executed Migration left to migrate down.",
    );
    return false;
  }

  logger.info(
    migrateConfirmationForDown.name,
    `Migration to migrate down: ${lastExecutedMigration.name}`,
  );

  return true;
}
