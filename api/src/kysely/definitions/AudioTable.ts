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
  /**
   * UUID
   */
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
   * Supported types
   * 1. audio/x-m4a
   * 1. audio/mpeg
   * 1. video/mp4
   * 1. video/x-m4v
   * 1. video/quicktime
   */
  mime_type: string;

  /**
   * Size of the file in bytes
   */
  size: number;

  /**
   * What language is used for this audio file
   */
  language: $LanguageCode;

  /**
   * Name of the audio file in the storage bucket. Right now this is the
   * `vanity_id` of the `PodcastEpisodeTable`.
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
