import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

import { PodcastPlatform } from "./types/PodcastPlatform.js";

/**
 * As each Episode can be externally hosted / published to many different
 * platforms like Spotify, Apple Podcast, etc... this table tracks all the
 * different places where each podcast is externally hosted on.
 */
export interface PodcastEpisodeExternallyHostedLinkTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  /**
   * Time of data creation, cannot be updated.
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * Which `PodcastEpisode` is this link for?
   */
  podcast_episode_id: NonUpdatableIdColumnType;

  /**
   * External Podcast Platform where episode is also published to, e.g. Spotify
   * / Apple Podcast.
   *
   * Using strings instead of foreign key / ID joins in DB since the only thing
   * that will be in the other table is just the name which wont change that
   * often if at all, and this will also make it easier to migrate this table to
   * NoSQL DBs in the future.
   */
  podcast_platform: PodcastPlatform;

  /**
   * Full URL string to the episode
   */
  url: string;
}

export type PodcastEpisodeExternallyHostedLink =
  Selectable<PodcastEpisodeExternallyHostedLinkTable>;
export type CreatePodcastEpisodeExternallyHostedLink =
  Insertable<PodcastEpisodeExternallyHostedLinkTable>;
export type UpdatePodcastEpisodeExternallyHostedLink =
  Updateable<PodcastEpisodeExternallyHostedLinkTable>;
