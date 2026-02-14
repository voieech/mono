import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableColumnType,
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
  UpdatableDateTimeColumnType,
  UpdatableIdColumnType,
} from "./types/index.js";

/**
 * Push notification tokens for user's device(s).
 */
export interface UserPushNotifTokensTable {
  /**
   * UUID.
   */
  id: NonUpdatableIdColumnType;

  /**
   * When is the push notification token first stored?
   */
  created_at: NonUpdatableDateTimeColumnType;

  /**
   * This is used to deal with the "Ghost Notification" issue, where the wrong
   * user receives a notification meant for someone else.
   *
   * The Scenario:
   * 1. User A logs into the app on a shared device. The device specific push
   * token is saved in DB linked to user_id: "A".
   * 1. User A logs out, and User B logs in on the same device.
   * 1. If your code doesn't update the record, the database still thinks that
   * specific device token belongs to User A.
   * 1. When your server sends a "Private message for User A" notification, it
   * goes to that device and User B sees it.
   *
   * "updated_at" helps with debugging this issue, as if the date is before
   * User B logged in, you know your "delete token on log out" or your "save
   * token on login" logic failed to trigger or update the record. It helps you
   * prove whether the app actually "claimed" the token for the new user.
   */
  updated_at: UpdatableDateTimeColumnType;

  /**
   * UUID.
   */
  user_id: UpdatableIdColumnType;

  /**
   * The actual Expo push notification token that will be used. This is globally
   * unique in the table since this is device specific and a device can only
   * receive 1 instance of each notification.
   *
   * This cannot be updated, since this is more or less the "unique primary key"
   * too and the row with this can only be deleted or have its other columns
   * updated.
   *
   * Expo token is tied to device/app installation, and not user account, so
   * this has to be unique. If the same token is received but other values
   * like "user_id" has changed, then the "user_id" should be updated instead,
   * as this means "a user logged out of account from device A and another
   * user logged into their account on the same device A"
   */
  expo_token: NonUpdatableColumnType<string>;

  /**
   * The push notification token that is native to the device / OS.
   *
   * This is nullable for now as it is stored as a backup and not used.
   */
  device_token: $Nullable<string>;

  /**
   * Which device platform is the `device_token` for?
   *
   * This is nullable for now as it is stored as a backup and not used.
   */
  device_platform: $Nullable<"ios" | "android">;
}

export type DatabaseUserPushNotifToken = Selectable<UserPushNotifTokensTable>;
export type DatabaseUserPushNotifTokenCreateArg =
  Insertable<UserPushNotifTokensTable>;
export type DatabaseUserPushNotifTokenUpdateArg =
  Updateable<UserPushNotifTokensTable>;
