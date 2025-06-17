import pc from "picocolors";

export function printMigrationCliHelp() {
  /* eslint-disable no-console */
  console.log("See help menu");
  console.log(pc.green("npm run db:migrate"));
  console.log(pc.green("npm run db:migrate help"));
  console.log();
  console.log("Create a new migration file");
  console.log(pc.green("npm run db:migrate create"));
  console.log();
  console.log("Migrate up to the latest migration");
  console.log(pc.green("npm run db:migrate all"));
  console.log();
  console.log("Migrate up one step");
  console.log(pc.green("npm run db:migrate up"));
  console.log();
  console.log("Migrate down one step");
  console.log(pc.red("npm run db:migrate down"));
  console.log();
  console.log(`For more details, see implementation: ${import.meta.dirname}`);
  console.log();
  /* eslint-enable no-console */
}
