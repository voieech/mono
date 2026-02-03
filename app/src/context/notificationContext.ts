import * as Notifications from "expo-notifications";
import { createContext } from "react";

import { createUseContextHook } from "@/utils";

export const NotificationContext = createContext<{
  expoPushToken: string;
  notification: Notifications.Notification | undefined;
}>(
  // @ts-expect-error
  null,
);

export const useNotifications = createUseContextHook(
  NotificationContext,
  "NotificaiontContext",
);
