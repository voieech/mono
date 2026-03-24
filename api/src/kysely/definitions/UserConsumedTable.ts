import type { Insertable, Selectable, Updateable } from "kysely";

import type { ConsumableItemType } from "../../dto-types/index.js";
import type { NonUpdatableColumnType } from "./types/index.js";
import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Polymorphic table to track all of a User's consumption, regardless of what
 * type of item is being consumed.
 */
export interface UserConsumedTable {
  /**
   * UUID v7
   */
  id: NonUpdatableIdColumnType;

  /**
   * When did the user consume this item?
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * UUID.
   */
  user_id: NonUpdatableIdColumnType;

  /**
   * Since this is a global consumption table (polymorphic), we need to specify
   * what is the type of the item that is consumed. This is a text column but we
   * only allow specific string keys to be used for consistency.
   */
  item_type: NonUpdatableColumnType<ConsumableItemType>;

  /**
   * UUID.
   */
  item_id: NonUpdatableIdColumnType;
}

export type DatabaseUserConsumed = Selectable<UserConsumedTable>;
export type DatabaseUserConsumedCreateArg = Insertable<UserConsumedTable>;
export type DatabaseUserConsumedUpdateArg = Updateable<UserConsumedTable>;
