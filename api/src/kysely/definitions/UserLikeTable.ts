import type { Insertable, Selectable, Updateable } from "kysely";

import type { LikeableItemType } from "../../dto-types/index.js";
import type { NonUpdatableColumnType } from "./types/index.js";
import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Polymorphic table to track all of a User's Likes, regardless of what type of
 * item is being liked.
 */
export interface UserLikeTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  /**
   * When did the user like this item?
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * UUID.
   */
  user_id: NonUpdatableIdColumnType;

  /**
   * Since this is a global likes table (polymorphic), we need to specify what
   * is the type of the item that is being liked. This is a text column but we
   * only allow specific string keys to be used for consistency.
   */
  item_type: NonUpdatableColumnType<LikeableItemType>;

  /**
   * UUID.
   */
  item_id: NonUpdatableIdColumnType;
}

export type DatabaseUserLike = Selectable<UserLikeTable>;
export type DatabaseUserLikeCreateArg = Insertable<UserLikeTable>;
export type DatabaseUserLikeUpdateArg = Updateable<UserLikeTable>;
