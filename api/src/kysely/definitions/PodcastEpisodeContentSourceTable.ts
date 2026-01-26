import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * A single `PodcastEpisode` can have multiple content sources, this table
 * tracks the source, where each row is a mapping of a podcast episode to
 * content source so that it can be used to determine what content to use for
 * `PodcastEpisode` creation next in order to avoid duplicate news content in
 * episodes.
 */
export interface PodcastEpisodeContentSourceTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  /**
   * Time of data creation, cannot be updated.
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * Podcast Episode ID
   */
  podcast_episode_id: NonUpdatableIdColumnType;

  /**
   * Type of content used, the `content_id` refers to the ID of a row in this
   * specific content table
   */
  content_type: "news_article" | "github_repo" | "tweet" | "youtube_video";

  /**
   * Content source ID
   */
  content_id: NonUpdatableIdColumnType;
}

export type DatabasePodcastEpisodeContentSource =
  Selectable<PodcastEpisodeContentSourceTable>;
export type DatabasePodcastEpisodeContentSourceCreateArg =
  Insertable<PodcastEpisodeContentSourceTable>;
export type DatabasePodcastEpisodeContentSourceUpdateArg =
  Updateable<PodcastEpisodeContentSourceTable>;
