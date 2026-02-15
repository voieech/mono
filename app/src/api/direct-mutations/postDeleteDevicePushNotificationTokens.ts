import type { PushNotificationTokens } from "dto";

import { wrappedFetch } from "@/api-client";
import { apiBaseUrl } from "@/constants";

/**
 * Delete device push notification tokens for user's current device
 */
export async function postDeleteDevicePushNotificationTokens(
  pushNotificationTokens: PushNotificationTokens,
) {
  const res = await wrappedFetch(
    `${apiBaseUrl}/v1/user/notification/push-notifications/delete-tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pushNotificationTokens),
    },
  );

  if (!res.ok) {
    const defaultErrorMessage = `Failed to delete device push notification tokens`;
    const errorMessage = await res
      .json()
      .then((data) => data.error ?? defaultErrorMessage)
      .catch(() => defaultErrorMessage);
    throw new Error(errorMessage);
  }
}
