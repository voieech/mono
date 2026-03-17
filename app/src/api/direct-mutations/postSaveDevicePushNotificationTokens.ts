import type { PushNotificationTokens } from "dto";

import { wrappedFetch, getResError } from "@/api-client";

/**
 * Save device push notification tokens for user's current device
 */
export async function postSaveDevicePushNotificationTokens(
  pushNotificationTokens: PushNotificationTokens,
) {
  const res = await wrappedFetch(
    `/v1/user/notification/push-notifications/save-tokens`,
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
      defaultErrorMessage: `Failed to save device push notification tokens`,
      logError: true,
    });
  }
}
