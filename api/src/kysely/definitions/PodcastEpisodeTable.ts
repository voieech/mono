import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Podcast Episode metadata, where each Podcast Episode is part of a
 * `PodcastChannel` like "Voieech DailyTech".
 *
 * `[vanity_id, language]` is used to form a unique composite key.
 */
export interface PodcastEpisodeTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  created_at: NonUpdatableDateTimeColumnType;

  /**
   * A short ID for vanity (nice looking URL's that are short) that is globally
   * unique per podcast episode but will be the same ID across different
   * languages. So `[vanity_id, language]` form a unique composite key.
   */
  vanity_id: NonUpdatableIdColumnType;

  /**
   * What language is this episode. This is used as part of
   * `[vanity_id, language]` to form a unique composite key.
   */
  language: $LanguageCode;

  /**
   * Human readable Episode unique identifier for that specific Channel
   */
  episode_number: $Nullable<number>;

  /**
   * Episode title shown to users
   */
  title: string;

  /**
   * Description shown to the users
   *
   * This should include the chapter name and timestamps as text if the episode
   * has different chapters in it.
   */
  description: string;

  /**
   * ID for the audio content, whose data will be used in web/app player
   * directly. The same audio file will also be hosted in the other various
   * platforms
   */
  audio_id: NonUpdatableIdColumnType;

  /**
   * Which channel is this Podcast Episode listed under?
   */
  channel_id: NonUpdatableIdColumnType;
}

export type PodcastEpisode = Selectable<PodcastEpisodeTable>;
export type CreatePodcastEpisode = Insertable<PodcastEpisodeTable>;
export type UpdatePodcastEpisode = Updateable<PodcastEpisodeTable>;
