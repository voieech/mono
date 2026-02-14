import type { ColumnType } from "kysely";

/**
 * Uses `string` type which most universal IDs should be.
 */
export type UpdatableIdColumnType = ColumnType<$ID>;
