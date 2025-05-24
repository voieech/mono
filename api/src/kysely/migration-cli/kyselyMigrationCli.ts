import "../../global/bootstrapGlobalDefinitions.js";
import { logger } from "../../logger.js";
import { createKyselyMigration } from "./createKyselyMigrationFile/createKyselyMigration.js";
import { kyselyMigration } from "./kyselyMigration.js";
import { migrateConfirmationForAll } from "./migrateConfirmation/migrateConfirmationForAll.js";
import { migrateConfirmationForDown } from "./migrateConfirmation/migrateConfirmationForDown.js";
import { migrateConfirmationForUp } from "./migrateConfirmation/migrateConfirmationForUp.js";
import { printAllMigrations } from "./printAllMigrations.js";
import { printMigrationCliHelp } from "./printMigrationCliHelp.js";

async function kyselyMigrationCli() {
  // No extra arguments, show help menu
  if (process.argv.length === 2) {
    printMigrationCliHelp();
    return;
  }

  const arg = process.argv.at(-1) ?? "";

  if (arg === "list") {
    await printAllMigrations();
    return;
  }

  if (arg === "all") {
    await kyselyMigration(migrateConfirmationForAll, (migrator) =>
      migrator.migrateToLatest(),
    );
    return;
  }

  if (arg === "up") {
    await kyselyMigration(migrateConfirmationForUp, (migrator) =>
      migrator.migrateUp(),
    );
    return;
  }

  if (arg === "down") {
    await kyselyMigration(migrateConfirmationForDown, (migrator) =>
      migrator.migrateDown(),
    );
    return;
  }

  if (arg === "create") {
    await createKyselyMigration();
    return;
  }

  logger.error(kyselyMigrationCli.name, `Invalid migration type: ${arg}\n`);
  printMigrationCliHelp();
}

kyselyMigrationCli();
