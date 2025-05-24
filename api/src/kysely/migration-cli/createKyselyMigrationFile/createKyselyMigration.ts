import fs from "fs";
import path from "path";
import readline from "readline/promises";

import { logger } from "../../../logger.js";
import { getMigrationIndex } from "./getMigrationIndex.js";
import { migrationFileTemplate } from "./migrationFileTemplate.js";

const migrationFolderPath = path.join(import.meta.dirname, `../../migrations`);

export async function createKyselyMigration() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const migrationName = await rl.question(
    `Migration name (lowercase with _ separation): `,
  );

  rl.close();

  if (migrationName.replaceAll(/^[_a-z0-9]+$/g, "") !== "") {
    logger.error(
      createKyselyMigration.name,
      `Migration name can only contain alphanumeric characters and _`,
    );
    return;
  }

  if (migrationName !== migrationName.replaceAll(/\s/g, "")) {
    logger.error(
      createKyselyMigration.name,
      `Migration name cannot have space, use _ instead`,
    );
    return;
  }

  if (migrationName !== migrationName.toLowerCase()) {
    logger.error(
      createKyselyMigration.name,
      `Migration name must be all lowercase`,
    );
    return;
  }

  const dateString = $DateTime.now.asIsoDate()

  const migrationIndex = getMigrationIndex(migrationFolderPath, dateString);

  const migrationFileName = `${dateString}_${migrationIndex}_${migrationName}.ts`;

  const migrationFilePath = path.join(migrationFolderPath, migrationFileName);

  fs.writeFileSync(migrationFilePath, migrationFileTemplate);

  logger.info(
    createKyselyMigration.name,
    `Created migration file at: ${migrationFilePath}`,
  );
}
