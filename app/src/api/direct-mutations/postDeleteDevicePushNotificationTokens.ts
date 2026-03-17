import type { PushNotificationTokens } from "dto";

import { wrappedFetch, getResError } from "@/api-client";

/**
 * Delete device push notification tokens for user's current device
 */
export async function postDeleteDevicePushNotificationTokens(
  pushNotificationTokens: PushNotificationTokens,
) {
  const res = await wrappedFetch(
    `/v1/user/notification/push-notifications/delete-tokens`,
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
      defaultErrorMessage: `Failed to delete device push notification tokens`,
      logError: true,
    });
  }
}
