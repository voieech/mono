import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Generic `PodcastChannel` that is for broad audience (not personalised for
 * users) e.g. "Voieech DailyTech" / "Voieech DailyTechZH"
 */
export interface PodcastChannelTable {
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
   * Home/main page of the channel on a particular podcast platform
   */
  url: string;
}

export type PodcastChannel = Selectable<PodcastChannelTable>;
export type CreatePodcastChannel = Insertable<PodcastChannelTable>;
export type UpdatePodcastChannel = Updateable<PodcastChannelTable>;
