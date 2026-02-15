import type { PushNotificationTokens } from "dto";

import { wrappedFetch } from "@/api-client";
import { apiBaseUrl } from "@/constants";

/**
 * Save device push notification tokens for user's current device
 */
export async function postSaveDevicePushNotificationTokens(
  pushNotificationTokens: PushNotificationTokens,
) {
  const res = await wrappedFetch(
    `${apiBaseUrl}/v1/user/notification/push-notifications/save-tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pushNotificationTokens),
    },
  );

  if (!res.ok) {
    const defaultErrorMessage = `Failed to save device push notification tokens`;
    const errorMessage = await res
      .json()
      .then((data) => data.error ?? defaultErrorMessage)
      .catch(() => defaultErrorMessage);
    throw new Error(errorMessage);
  }
}
