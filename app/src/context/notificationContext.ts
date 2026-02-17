import type { PushNotificationTokens } from "dto";
import type { NotificationPermissionsStatus } from "expo-notifications";

import * as Notifications from "expo-notifications";
import { createContext } from "react";

import { createUseContextHook } from "@/utils";

export const NotificationContext = createContext<{
  /**
   * What is the current status of notification permissions?
   */
  notificationPermissionsStatus: undefined | NotificationPermissionsStatus;

  /**
   * Push notification tokens. These are only available if they are loaded
   * successfully, and they can be unpopulated if the user has not given
   * explicit permissions yet for notifications.
   */
  pushTokens: undefined | PushNotificationTokens;

  /**
   * Tries to retrieve updated push notification tokens if available, and calls
   * API to sync the state of the push notification tokens (either they belong
   * to a user now if user is logged in or it should be deleted since it doesnt
   * belong to anyone if user is logged out)
   */
  syncPushNotificationData: () => Promise<void>;

  /**
   * The latest notification received while the app is in the foreground.
   */
  notification: Notifications.Notification | undefined;
}>(
  // @ts-expect-error
  null,
);

export const useNotification = createUseContextHook(
  NotificationContext,
  "NotificationContext",
);
