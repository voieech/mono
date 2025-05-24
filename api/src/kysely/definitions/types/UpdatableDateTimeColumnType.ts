import type { ColumnType } from "kysely";

/**
 * Updatable column type uses the global `$DateTime.ISO.DateTime.Strong` type.
 *
 * The underlying `pg` library is configured to use the
 * `$DateTime.ISO.DateTime.makeStrongAndThrowOnError` parser/validator when
 * reading string values from the postgres DB.
 */
export type UpdatableDateTimeColumnType = ColumnType<
  $DateTime.ISO.DateTime.Strong,
  $DateTime.ISO.DateTime.Strong,
  $DateTime.ISO.DateTime.Strong
>;
