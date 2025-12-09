import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
  UpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Content crawled from twitter
 */
export interface ContentTweetTable {
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
   * Twitter's tweet ID
   */
  tweet_id: string;

  /**
   * URL to the original tweet
   */
  url: string;

  /**
   * Tweet's author's name
   */
  author_name: string;

  /**
   * Tweet's author's username
   */
  author_username: string;

  /**
   * The actual text content of the tweet itself
   */
  text: string;

  view_count: number;

  like_count: number;

  retweet_count: number;

  reply_count: number;

  /**
   * What language is this tweet written in
   */
  language: $LanguageCode;

  /**
   * @todo This is basically tags, will move this out in the future
   */
  category: string;
}

export type ContentTweet = Selectable<ContentTweetTable>;
export type CreateContentTweet = Insertable<ContentTweetTable>;
export type UpdateContentTweet = Updateable<ContentTweetTable>;
