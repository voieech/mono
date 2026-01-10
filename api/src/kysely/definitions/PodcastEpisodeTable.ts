import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
  UpdatableDateTimeColumnType,
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

  /**
   * When is the episode created.
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * Globally unique short ID for vanity (nice looking URL's that are short)
   */
  vanity_id: NonUpdatableIdColumnType;

  /**
   * What language is this episode in. This should be the same as the
   * `PodcastChannel['language']`.
   */
  language: $LanguageCode;

  /**
   * Human readable Season unique identifier for that specific Channel
   */
  season_number: $Nullable<number>;

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

  /**
   * URL of the episode image.
   *
   * Set this to the same as `PodcastChannel['img_url']` if no new custom image
   * is available for this episode.
   */
  img_url: string;

  /**
   * Youtube video ID of episodes that are also published onto youtube.
   */
  youtube_id: $Nullable<string>;

  /**
   * When was the Youtube Video count metrics last updated?
   */
  youtube_video_count_last_updated_date: $Nullable<UpdatableDateTimeColumnType>;

  /**
   * Youtube video's view count that is updated asynchronously. See
   * `youtube_video_count_last_updated_date`.
   */
  youtube_video_count_view: $Nullable<number>;

  /**
   * Youtube video's like count that is updated asynchronously. See
   * `youtube_video_count_last_updated_date`.
   */
  youtube_video_count_like: $Nullable<number>;

  /**
   * Youtube video's comment count that is updated asynchronously. See
   * `youtube_video_count_last_updated_date`.
   */
  youtube_video_count_comment: $Nullable<number>;
}

export type PodcastEpisode = Selectable<PodcastEpisodeTable>;
export type CreatePodcastEpisode = Insertable<PodcastEpisodeTable>;
export type UpdatePodcastEpisode = Updateable<PodcastEpisodeTable>;
