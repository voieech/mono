import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * All tag names will be in english so that there wont be duplicated tags in
 * different languages, i.e. tech and 科技.
 *
 * When tags are being used by users, we will do translation back to english
 * for tag filtering.
 */
export interface ContentTagTable {
  id: NonUpdatableIdColumnType;

  /**
   * Time of tagging
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * ID for the content that this tag is for
   */
  content_id: NonUpdatableIdColumnType;

  /**
   * The actual 'tag' itself
   */
  tag: string;

  /**
   * Weight (integer between 0-100 and no decimals) of this tag for this
   * content. Denotes how relevant is this tag for this content and a tag should
   * only be stored if it scores above a certain bar to be considered a relevant
   * tag, e.g. more than 30% relevant.
   */
  weight: number;
}

export type ContentTag = Selectable<ContentTagTable>;
export type CreateContentTag = Insertable<ContentTagTable>;
export type UpdateContentTag = Updateable<ContentTagTable>;
