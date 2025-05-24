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
  id: NonUpdatableIdColumnType;

  created_at: NonUpdatableDateTimeColumnType;

  /**
   * Podcast Episode ID
   */
  podcast_episode_id: NonUpdatableIdColumnType;

  /**
   * Content source ID
   */
  content_id: NonUpdatableIdColumnType;
}

export type PodcastEpisodeContentSource =
  Selectable<PodcastEpisodeContentSourceTable>;
export type CreatePodcastEpisodeContentSource =
  Insertable<PodcastEpisodeContentSourceTable>;
export type UpdatePodcastEpisodeContentSource =
  Updateable<PodcastEpisodeContentSourceTable>;
