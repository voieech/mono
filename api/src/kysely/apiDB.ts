import { createDB } from "../kysely/createDB.js";

export const apiDB = createDB({
  connectionString: process.env["DB_CONN_STRING"]!,
});
