import fs from "fs";

/**
 * Get the migration index, where there can be more than 1 migration a day
 */
export function getMigrationIndex(
  migrationFolderPath: string,
  dateString: string,
) {
  const migrationFileNames = fs.readdirSync(migrationFolderPath);

  // Get all the `${migrationDate}_${migrationIndex}` strings
  const migrationDates = migrationFileNames
    .map((name) => name.split("_").slice(0, 2).join(""))
    .filter((name) => name !== undefined);

  // Find all the migrations that happened on the same as today's date string
  const migrationDatesWithTheSameDate = migrationDates.filter((migrationDate) =>
    migrationDate.includes(dateString),
  );

  // Get the last migration index of today if any
  const lastUsedMigrationIndex = migrationDatesWithTheSameDate
    .map((dateWithIndex) => parseInt(dateWithIndex.slice(8))) // 8 bcs YYYYMMDD
    .sort((a, b) => a - b)
    .at(-1);

  const migrationIndex = (lastUsedMigrationIndex ?? 0) + 1;

  return migrationIndex;
}
