import type { Insertable, Selectable, Updateable } from "kysely";

import type { SubscribableItemType } from "../../dto-types/index.js";
import type { NonUpdatableColumnType } from "./types/index.js";
import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Polymorphic table to track all of a User's subscriptions, regardless of what
 * type of item is being subscribed to.
 */
export interface UserSubscriptionTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  /**
   * When did the user subscribe to this item?
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * UUID.
   */
  user_id: NonUpdatableIdColumnType;

  /**
   * Since this is a global subscriptions table (polymorphic), we need to
   * specify what is the type of the item that is being subscribed to. This is a
   * text column but we only allow specific string keys to be used for
   * consistency.
   */
  item_type: NonUpdatableColumnType<SubscribableItemType>;

  /**
   * UUID.
   */
  item_id: NonUpdatableIdColumnType;
}

export type DatabaseUserSubscription = Selectable<UserSubscriptionTable>;
export type DatabaseUserSubscriptionCreateArg =
  Insertable<UserSubscriptionTable>;
export type DatabaseUserSubscriptionUpdateArg =
  Updateable<UserSubscriptionTable>;
