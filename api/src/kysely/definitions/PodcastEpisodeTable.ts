import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Podcast Episode metadata, where each Podcast Episode is part of a
 * `PodcastChannel` like "Voieech DailyTech".
 */
export interface PodcastEpisodeTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  created_at: NonUpdatableDateTimeColumnType;

  /**
   * A short ID for vanity (nice looking URL's that are short) that is globally
   * unique per podcast episode.
   */
  vanity_id: NonUpdatableIdColumnType;

  /**
   * What language is this episode in. This should be the same as the
   * `PodcastChannel['language']`.
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
