import type { PushNotificationTokens } from "dto";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useState, useEffect } from "react";
import { Platform } from "react-native";

import { useAuthContext } from "@/context/authContext";
import { NotificationContext } from "@/context/notificationContext";

export function NotificationProvider({ children }: PropsWithChildren) {
  const [pushTokens, setPushTokens] = useState<
    undefined | PushNotificationTokens
  >(undefined);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const authContext = useAuthContext();

  async function updatePushNotificationTokens() {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      throw new Error(
        "Expo Project ID not found when loading notification tokens",
      );
    }

    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    const devicePushToken = await Notifications.getDevicePushTokenAsync();

    setPushTokens({
      expoToken: expoPushToken.data,
      devicePlatform: devicePushToken.type as "ios" | "android",
      deviceToken: devicePushToken.data,
    });
  }

  useEffect(() => {
    // Do nothing if user is not authenticated
    if (!authContext.isAuthenticated) {
      return;
    }

    setupNotifications();
    updatePushNotificationTokens();

    // React when a notification arrives while the app is in the foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    // React to user interaction with app notifcations
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [authContext.isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        pushTokens,
        updatePushNotificationTokens,
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
