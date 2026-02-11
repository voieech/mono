import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
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

  const notificationPermissionsStatus =
    await Notifications.getPermissionsAsync();

  let finalStatus = notificationPermissionsStatus.status;
  if (notificationPermissionsStatus.status !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return undefined;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    throw new Error("Project ID not found");
  }

  const { data: pushTokenString } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return pushTokenString;
}
