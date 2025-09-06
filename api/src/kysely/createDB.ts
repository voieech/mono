import type { LogLevel } from "kysely";

import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import type { Database } from "./definitions/index.js";

// Use custom parser for timestamp (oid 1114) so that the returned data type is
// always a validated/Strong ISO DateTime string instead of the JS Date object.
// Note that this does not have to handle the `null` value input case since pg
// doesnt call parser function for null values.
// https://kysely.dev/docs/recipes/data-types#configuring-runtime-javascript-types
// https://github.com/brianc/node-pg-types
// https://github.com/brianc/node-pg-types/blob/master/lib/builtins.js
pg.types.setTypeParser(1114, $DateTime.ISO.DateTime.makeStrongAndThrowOnError);

// Custom parser for vector (oid 1884170) from the pgvector extension so that
// the returned data type is an array of numbers instead of a string.
pg.types.setTypeParser(1884170, JSON.parse);

/**
 * Creates a new kysely db instance. You should only create one instance per
 * use case, so e.g. for API services, all API services should only share a
 * single instance as this does connection pooling internally already.
 *
 * ## More info on Kysely
 * Kysely knows your database structure using the generic Database interface
 * passed to its constructor.
 *
 * Kysely knows how to communicate with your database using the given `dialect`.
 *
 * In most cases, you should only create a single Kysely instance per database
 * as most dialect implementations use a connection pool internally, or no
 * connections at all, so you should not create a new instance for each request.
 */
export function createDB(config: {
  connectionString: string;
  kysely_log_query?: boolean;
  kysely_log_error?: boolean;
}) {
  const log: Array<LogLevel> = [];
  if (config.kysely_log_query) {
    log.push("query");
  }
  if (config.kysely_log_error) {
    log.push("error");
  }

  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new pg.Pool(config),
    }),
    log,
  });
}
