import type { ColumnType } from "kysely";

/**
 * Generic type that ensures that a column is not updatable.
 */
export type NonUpdatableColumnType<T> = ColumnType<T, T, never>;
