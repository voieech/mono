import type { NonUpdatableColumnType } from "./NonUpdatableColumnType.js";

/**
 * Uses `string` type which most universal IDs should be. Note that this column
 * cannot be updated once set.
 */
export type NonUpdatableIdColumnType = NonUpdatableColumnType<$ID>;
