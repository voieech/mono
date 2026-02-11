import * as Notifications from "expo-notifications";
import { PropsWithChildren, useState, useEffect } from "react";

import { NotificationContext } from "@/context/notificationContext";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";

export function NotificationProvider({ children }: PropsWithChildren) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => console.error(error));

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
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
}
