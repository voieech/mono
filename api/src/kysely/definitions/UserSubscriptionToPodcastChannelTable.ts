import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * User's Podcast Channel subscriptions
 */
export interface UserSubscriptionToPodcastChannelTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  /**
   * When did the user subscribe? I.e. when was this subcription created?
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * UUID.
   */
  user_id: NonUpdatableIdColumnType;

  /**
   * UUID.
   */
  podcast_channel_id: NonUpdatableIdColumnType;
}

export type DatabaseUserSubscriptionToPodcastChannel =
  Selectable<UserSubscriptionToPodcastChannelTable>;
export type DatabaseUserSubscriptionToPodcastChannelCreateArg =
  Insertable<UserSubscriptionToPodcastChannelTable>;
export type DatabaseUserSubscriptionToPodcastChannelUpdateArg =
  Updateable<UserSubscriptionToPodcastChannelTable>;
