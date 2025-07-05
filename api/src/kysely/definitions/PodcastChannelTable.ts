import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Generic `PodcastChannel` that is for broad audience (not personalised for
 * users) e.g. "Voieech DailyTech" / "Voieech DailyTechZH".
 *
 * Note that this is platform independent, since the same PodcastChannel's
 * content can be hosted on multiple platforms.
 */
export interface PodcastChannelTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  /**
   * When is this Podcast Channel first created
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * Name of the PodcastChannel, and can be in whatever language is specified in
   * the `language` column. E.g. "Voieech DailyTech" / "科技日报"
   */
  name: string;

  /**
   * PodcastChannel description, and can be in whatever language is specified in
   * the `language` column.
   */
  description: string;

  /**
   * What is the language for this entire PodcastChannel?
   */
  language: $LanguageCode;

  /**
   * URL of the channel image.
   */
  img_url: string;

  /**
   * Category, e.g. "Technology"
   *
   * This will always be in english, and users will see the localised string in
   * app when we return / display in the UI according to the `language` column
   * (also because Apple Podcast only allow a list of fixed categories in
   * english).
   */
  category: string;

  /**
   * Optional subcategory, e.g. "Daily News"
   *
   * This will always be in english, and users will see the localised string in
   * app when we return / display in the UI according to the `language` column
   * (also because Apple Podcast only allow a list of fixed categories in
   * english).
   */
  subcategory: $Nullable<string>;
}

export type PodcastChannel = Selectable<PodcastChannelTable>;
export type CreatePodcastChannel = Insertable<PodcastChannelTable>;
export type UpdatePodcastChannel = Updateable<PodcastChannelTable>;
