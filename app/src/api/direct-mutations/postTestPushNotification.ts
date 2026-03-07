import type { PushNotificationTokens } from "dto";

import { wrappedFetch } from "@/api-client";

/**
 * Request for a push notification test for user's current device
 */
export async function postTestPushNotification(
  pushNotificationTokens: PushNotificationTokens,
) {
  const res = await wrappedFetch(
    `/v1/user/notification/push-notifications/test-notification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pushNotificationTokens),
    },
  );

  if (!res.ok) {
    const defaultErrorMessage = `Failed to trigger device push notification test`;
    const errorMessage = await res
      .json()
      .then((data) => data.error ?? defaultErrorMessage)
      .catch(() => defaultErrorMessage);
    throw new Error(errorMessage);
  }
}
