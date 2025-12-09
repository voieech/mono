import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
  UpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Content crawled from youtube videos
 */
export interface ContentYoutubeVideoTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  /**
   * Time of content insertion / web crawl time
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * When did the content originally get published at? If this is not available
   * use `created_at` time as substitute
   */
  published_at: UpdatableDateTimeColumnType;

  /**
   * Youtube's channel ID
   */
  channel_id: string;

  /**
   * Youtube's channel title
   */
  channel_title: string;

  /**
   * Youtube's video's URL
   */
  video_url: string;

  /**
   * Youtube's video ID
   */
  video_id: string;

  /**
   * Youtube's video title
   */
  video_title: string;

  /**
   * @todo Rename this to "video_duration"?
   */
  duration: $Nullable<number>;

  view_count: $Nullable<number>;

  like_count: $Nullable<number>;

  comment_count: $Nullable<number>;

  /**
   * When is the video stats like `view_count` last updated at?
   */
  stats_fetched_at: UpdatableDateTimeColumnType;

  /**
   * @todo This is basically tags, will move this out in the future
   */
  classification: $Nullable<string>;

  /**
   * @todo This is basically tags, will move this out in the future
   */
  confidence: $Nullable<string>;

  /**
   * @todo
   */
  has_subtitles: boolean;

  /**
   * @todo
   */
  transcript_method: $Nullable<string>;

  /**
   * @todo
   */
  transcript_status: string;

  /**
   * @todo Rename to transcript_error_message
   */
  error_message: $Nullable<string>;

  /**
   * @todo Rename to transcript_duration
   */
  total_duration_transcribed: $Nullable<number>;

  /**
   * @todo
   */
  transcript_text: $Nullable<string>;

  /**
   * @todo
   */
  snippet_count: $Nullable<number>;
}

export type ContentYoutubeVideo = Selectable<ContentYoutubeVideoTable>;
export type CreateContentYoutubeVideo = Insertable<ContentYoutubeVideoTable>;
export type UpdateContentYoutubeVideo = Updateable<ContentYoutubeVideoTable>;
