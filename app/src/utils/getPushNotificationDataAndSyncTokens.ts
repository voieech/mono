import type { PushNotificationTokens } from "dto";

import * as Notifications from "expo-notifications";

import {
  postSaveDevicePushNotificationTokens,
  postDeleteDevicePushNotificationTokens,
} from "@/api";

import { getPushNotificationTokens } from "./getPushNotificationTokens";

/**
 * Get latest push notification tokens and sync with API.
 *
 * API Syncing method:
 * 1. Save token: User is logged in AND granted push notification permission
 * 1. Delete token: User is not logged in, or didnt grant permission
 */
export function getPushNotificationDataAndSyncTokens(
  isAuthenticated: boolean,
  notificationPermissionsStatus: Notifications.NotificationPermissionsStatus,
) {
  if (isAuthenticated && notificationPermissionsStatus.granted) {
    syncTokensActionQueue.push("save");
  } else {
    syncTokensActionQueue.push("delete");
  }

  if (syncTokenActionLoopPromise !== null) {
    return syncTokenActionLoopPromise;
  }

  syncTokenActionLoopPromise = syncTokensActionQueueProcessor();

  // @todo When do i clear this promise??

  return syncTokenActionLoopPromise;
}

const syncTokensActionQueue: Array<"save" | "delete"> = [];

let syncTokenActionLoopPromise: null | Promise<any> = null;

async function syncTokensActionQueueProcessor() {
  let pushNotificationTokens: PushNotificationTokens | null = null;

  // For as long as there is at least 1 item in the `syncTokensActionQueue` list
  // (check by seeing if last item in list is not undefined), we will take the
  // last action in the `syncTokensActionQueue` to execute it and delete the
  // rest of the actions in the queue. Here we can delete and ignore the other
  // actions in the queue because those are already "out of date" by the time
  // there is a new / latest action in the queue.
  while (
    syncTokensActionQueue[syncTokensActionQueue.length - 1] !== undefined
  ) {
    const currentSyncTokensAction =
      syncTokensActionQueue[syncTokensActionQueue.length - 1]!;

    // Delete the rest of the actions in the queue that is "out of date"
    syncTokensActionQueue.length = 0;

    pushNotificationTokens = await getPushNotificationTokens();

    if (currentSyncTokensAction === "save") {
      await postSaveDevicePushNotificationTokens(pushNotificationTokens);
    } else {
      await postDeleteDevicePushNotificationTokens(pushNotificationTokens);
    }
  }

  // If for some reason the loop never ever runs, we will return the push
  // notification tokens directly instead of returning null.
  if (pushNotificationTokens === null) {
    return getPushNotificationTokens();
  }

  // Return newest push notification tokens available after the processing loop
  return pushNotificationTokens;
}
