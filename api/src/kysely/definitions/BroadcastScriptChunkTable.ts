import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Used for podcast generation
 */
export interface BroadcastScriptChunkTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;
  created_at: NonUpdatableDateTimeColumnType;
  updated_at: NonUpdatableDateTimeColumnType;

  /**
   * Which channel is this content for?
   */
  channel_id: NonUpdatableIdColumnType;

  /**
   * Which episode is this content for?
   */
  episode_id: NonUpdatableIdColumnType;

  /**
   * Which content is this chunk from?
   */
  content_id: NonUpdatableIdColumnType;

  /**
   * Number between 1 to 4
   */
  story_number: number;

  /**
   * Chunks are ordered
   */
  chunk_number: number;

  /**
   * Original text of the chunk
   */
  chunk_text: number;

  /**
   * Number of tokens used by this chunk
   */
  chunk_token_count: number;

  /**
   * What is the language for this entire BroadcastScriptChunk?
   */
  language: $LanguageCode;

  /**
   * Originally `vector(1536)`, this is converted to `Array<number>` with a
   * custom kysely type parser.
   */
  embedding_openai_1536: $Nullable<Array<number>>;

  /**
   * Originally `vector(1024)`, this is converted to `Array<number>` with a
   * custom kysely type parser.
   */
  embedding_voyage_1024: $Nullable<Array<number>>;
}

export type BroadcastScriptChunk = Selectable<BroadcastScriptChunkTable>;
export type CreateBroadcastScriptChunk = Insertable<BroadcastScriptChunkTable>;
export type UpdateBroadcastScriptChunk = Updateable<BroadcastScriptChunkTable>;
