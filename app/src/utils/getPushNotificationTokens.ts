import type { PushNotificationTokens } from "dto";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

export async function getPushNotificationTokens(): Promise<PushNotificationTokens> {
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error(
      "Expo Project ID not found when loading notification tokens",
    );
  }

  const [expoPushToken, devicePushToken] = await Promise.all([
    Notifications.getExpoPushTokenAsync({ projectId }),
    Notifications.getDevicePushTokenAsync(),
  ]);

  return {
    expoToken: expoPushToken.data,
    devicePlatform: devicePushToken.type as "ios" | "android",
    deviceToken: devicePushToken.data,
  };
}
