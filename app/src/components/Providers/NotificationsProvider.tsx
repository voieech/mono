import type { PushNotificationTokens } from "dto";
import type { NotificationPermissionsStatus } from "expo-notifications";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Platform } from "react-native";

import { useAuthContext } from "@/context/authContext";
import { NotificationContext } from "@/context/notificationContext";
import { getPushNotificationDataAndSyncTokens } from "@/utils";

export function NotificationProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [notificationPermissionsStatus, setNotificationPermissionsStatus] =
    useState<undefined | NotificationPermissionsStatus>(undefined);
  const [pushTokens, setPushTokens] = useState<
    undefined | PushNotificationTokens
  >(undefined);
  const authContext = useAuthContext();

  // Getting of notification permissions status and sync+getting of notification
  // tokens is split up (i.e. not done all within
  // `getPushNotificationDataAndSyncTokens`) so that the getting of push
  // notification permission status + setting of local state wont be blocked
  // just because push notification token cant be read (when user havent grant
  // permission yet).
  const syncPushNotificationData = useCallback(
    async function () {
      const notificationPermissionsStatus =
        await Notifications.getPermissionsAsync();

      setNotificationPermissionsStatus(notificationPermissionsStatus);

      const pushNotificationTokens = await getPushNotificationDataAndSyncTokens(
        authContext.isAuthenticated,
        notificationPermissionsStatus,
      );

      setPushTokens(pushNotificationTokens);
    },
    [authContext.isAuthenticated],
  );

  // This runs everytime user's auth status changes
  useEffect(() => {
    // Fire and forget the sync push notif token API call
    syncPushNotificationData();

    // Only setup push notif if user is authenticated
    if (authContext.isAuthenticated) {
      setupNotifications();
    }
  }, [authContext.isAuthenticated, syncPushNotificationData, router]);

  // Track ID of the last notification that is already processed, so that if the
  // same notification with the same ID triggers a processing, it will be
  // de-duplicated and ignored.
  const lastProcessedNotificationID = useRef<string | null>(null);

  // Hook that gets the last notification user response (on startup if user
  // clicked the push notification while app is in a "killed" state), and also
  // subscribes to future notification user responses through this hook for us
  // to handle.
  const lastNotificationUserResponse =
    Notifications.useLastNotificationResponse();

  useEffect(() => {
    // If null or undefined, means that there is no notification response
    if (lastNotificationUserResponse == null) {
      return;
    }

    const currentNotificationID =
      lastNotificationUserResponse.notification.request.identifier;

    // If notification is already processed before, ignore it
    if (currentNotificationID === lastProcessedNotificationID.current) {
      return;
    }

    const appRoute =
      lastNotificationUserResponse.notification.request.content.data.appRoute;

    // @todo Improve validation, and check whether it is a valid href
    if (typeof appRoute !== "string") {
      return;
    }

    // Store current notification ID to indicate that it is processed already to
    // de-dup future processing if the same notification ID is seen.
    // This is ran before route navigation to prevent race conditions.
    lastProcessedNotificationID.current = currentNotificationID;

    if (appRoute.startsWith("https://")) {
      WebBrowser.openBrowserAsync(appRoute);
    } else {
      router.push(appRoute as any);
    }
  }, [lastNotificationUserResponse, router]);

  return (
    <NotificationContext.Provider
      value={{
        notificationPermissionsStatus,
        pushTokens,
        syncPushNotificationData,
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
