import type { PushNotificationTokens } from "dto";

import { wrappedFetch, getResError } from "@/api-client";

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
    throw await getResError({
      res,
      defaultErrorMessage: `Failed to trigger device push notification test`,
      logError: true,
    });
  }
}
