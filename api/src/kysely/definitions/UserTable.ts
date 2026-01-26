import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * User details. Most of these are synced from WorkOS.
 */
export interface UserTable {
  /**
   * UUID. This is also the `external_id` set in WorkOS for this user.
   */
  id: NonUpdatableIdColumnType;

  /**
   * Unique User ID in WorkOS in the `user_${randomAlphaNumeric}` format.
   */
  workos_id: NonUpdatableIdColumnType;

  /**
   * When is this user created at? When did this user first sign up?
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * User's email address
   */
  email: string;

  /**
   * Is the user's email address verified?
   */
  email_verified: boolean;

  /**
   * What is the user's locale?
   */
  locale: $Nullable<$LanguageCode>;

  /**
   * The user's first name.
   */
  first_name: string;

  /**
   * The user's last name.
   */
  last_name: string;

  /**
   * User's profile picture URL.
   */
  profile_picture_url: $Nullable<string>;
}

export type DatabaseUser = Selectable<UserTable>;
export type DatabaseUserCreateArg = Insertable<UserTable>;
export type DatabaseUserUpdateArg = Updateable<UserTable>;
