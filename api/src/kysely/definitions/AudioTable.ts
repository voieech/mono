import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Metadata for all generated audio files, these are files that are accessible
 * by users or needed for future use / backup / caching.
 */
export interface AudioTable {
  id: NonUpdatableIdColumnType;

  /**
   * When is this audio file generated?
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * Public link to the audio file stored in cloud storage bucket
   */
  public_url: string;

  /**
   * What language is used for this audio file
   */
  language: $LanguageCode;

  /**
   * File name, name can be in the audio file's language
   */
  name: string;

  /**
   * Length of audio file in seconds
   */
  length: number;

  /**
   * AI model used to generate the audio file (text to speech model)
   */
  ai_model: string;

  /**
   * Optional as not all audio files have captions generated for it
   */
  srt: $Nullable<string>;

  /**
   * Optional as not all audio files need SSML.
   *
   * Storing so that this audio file can be regenerated with this SSML file.
   */
  ssml: $Nullable<string>;

  /**
   * Optional and only required if ssml is available.
   */
  ssml_model: $Nullable<string>;
}

export type Audio = Selectable<AudioTable>;
export type CreateAudio = Insertable<AudioTable>;
export type UpdateAudio = Updateable<AudioTable>;
