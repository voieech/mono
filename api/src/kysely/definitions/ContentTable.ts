import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
  UpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Actual content from the various news sources
 */
export interface ContentTable {
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
  original_content_publised_at: UpdatableDateTimeColumnType;

  /**
   * Root domain of where this content originated from
   */
  domain: string;

  /**
   * URL of where this content originated from
   */
  url: string;

  /**
   * What language is this content written in
   */
  language: $LanguageCode;

  /**
   * The actual content (title) text source itself that is extracted from the
   * HTML, without any processing with LLM/AI yet
   */
  content_title: string;

  /**
   * The actual content (body) text source itself that is extracted from the
   * HTML, without any processing with LLM/AI yet
   */
  content_body: string;

  /**
   * Optional link to the first image from the source site
   */
  img_url: $Nullable<string>;

  /**
   * Optional ranking number for which position does this content appears on in
   * the source site
   */
  rank_on_page: $Nullable<number>;

  // @todo Add content embedding as needed in the future
}

export type Content = Selectable<ContentTable>;
export type CreateContent = Insertable<ContentTable>;
export type UpdateContent = Updateable<ContentTable>;
