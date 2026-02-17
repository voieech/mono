import * as Notifications from "expo-notifications";

import {
  postSaveDevicePushNotificationTokens,
  postDeleteDevicePushNotificationTokens,
} from "@/api";

import { getPushNotificationTokens } from "./getPushNotificationTokens";

/**
 * Get latest push notification data/status and tokens, and sync with API.
 *
 * API Syncing method:
 * 1. Save token: User is logged in AND granted push notification permission
 * 1. Delete token: User is not logged in, or didnt grant permission
 */
export async function getPushNotificationDataAndSyncTokens(
  isAuthenticated: boolean,
) {
  const notificationPermissionsStatus =
    await Notifications.getPermissionsAsync();

  const pushNotificationTokens = await getPushNotificationTokens();

  if (isAuthenticated && notificationPermissionsStatus.granted) {
    await postSaveDevicePushNotificationTokens(pushNotificationTokens);
  } else {
    await postDeleteDevicePushNotificationTokens(pushNotificationTokens);
  }

  return {
    notificationPermissionsStatus,
    pushNotificationTokens,
  };
}
