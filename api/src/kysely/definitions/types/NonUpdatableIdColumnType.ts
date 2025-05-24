import type { ColumnType } from "kysely";

/**
 * Uses `string` type which most universal IDs should be. Note that this column
 * cannot be updated once set.
 */
export type NonUpdatableIdColumnType = ColumnType<$ID, $ID, never>;
