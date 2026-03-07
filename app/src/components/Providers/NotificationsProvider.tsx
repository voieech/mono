import type { PushNotificationTokens } from "dto";
import type { NotificationPermissionsStatus } from "expo-notifications";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";

import { useAuthContext } from "@/context/authContext";
import { NotificationContext } from "@/context/notificationContext";
import { getPushNotificationDataAndSyncTokens } from "@/utils";

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notificationPermissionsStatus, setNotificationPermissionsStatus] =
    useState<undefined | NotificationPermissionsStatus>(undefined);
  const [pushTokens, setPushTokens] = useState<
    undefined | PushNotificationTokens
  >(undefined);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const authContext = useAuthContext();

  const syncPushNotificationPermissionsStatus = useCallback(
    () =>
      Notifications.getPermissionsAsync().then(
        setNotificationPermissionsStatus,
      ),
    [],
  );

  const syncPushNotificationTokens = useCallback(
    () =>
      getPushNotificationDataAndSyncTokens(authContext.isAuthenticated).then(
        setPushTokens,
      ),
    [authContext.isAuthenticated],
  );

  const syncPushNotificationData = useCallback(
    function () {
      // Trigger all the other sync functions in a fire and forget style
      // These other sync functions are split up so that they do not block each
      // other, e.g. push notification permission status sync wont be blocked
      // just because push notification token cant be read.
      syncPushNotificationPermissionsStatus();
      syncPushNotificationTokens();
    },
    [syncPushNotificationPermissionsStatus, syncPushNotificationTokens],
  );

  // This runs everytime user's auth status changes
  useEffect(() => {
    // Fire and forget the sync push notif token API call
    syncPushNotificationData();

    // Only setup push notif if user is authenticated
    if (authContext.isAuthenticated) {
      setupNotifications();

      // React when a notification arrives while the app is in the foreground
      const notificationListener =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      // React to user interaction with app notifcations
      const responseListener =
        Notifications.addNotificationResponseReceivedListener((response) => {
          // @todo
          console.log(response);
        });

      return () => {
        notificationListener.remove();
        responseListener.remove();
      };
    }
  }, [authContext.isAuthenticated, syncPushNotificationData]);

  return (
    <NotificationContext.Provider
      value={{
        notificationPermissionsStatus,
        pushTokens,
        syncPushNotificationData,
        notification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

async function setupNotifications() {
  if (!Device.isDevice) {
    throw new Error("Must use physical device for push notifications");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      // set priorty level to max on android as some lower priorty prevents notifications from appearing
      importance: Notifications.AndroidImportance.MAX,
      lightColor: "#FF231F7C",
    });
  }
}
