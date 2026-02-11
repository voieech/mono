import * as Notifications from "expo-notifications";
import { createContext } from "react";

import { createUseContextHook } from "@/utils";

export const NotificationContext = createContext<{
  expoPushToken: null | string;
  devicePushToken: null | string;
  updatePushNotificationTokens: () => Promise<void>;
  notification: Notifications.Notification | undefined;
}>(
  // @ts-expect-error
  null,
);

export const useNotification = createUseContextHook(
  NotificationContext,
  "NotificationContext",
);
