import type { PushNotificationTokens } from "dto";

import * as Notifications from "expo-notifications";

import {
  postSaveDevicePushNotificationTokens,
  postDeleteDevicePushNotificationTokens,
} from "@/api";

import { getPushNotificationTokens } from "./getPushNotificationTokens";

/**
 * Queue of syncTokenActions where it is ordered by oldest to newest actions
 * requested by the caller/users.
 */
const syncTokensActionsQueue: Array<"save" | "delete"> = [];

/**
 * Promise to track whether the syncTokenActions queue is currently being
 * processed or not, to handle de-duplication
 */
let syncTokensActionsQueueProcessingPromise: null | Promise<any> = null;

/**
 * Set a syncTokenAction to sync data with API, and get the latest push
 * notification tokens after processing all the available syncTokenActions in
 * the queue.
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
    syncTokensActionsQueue.push("save");
  } else {
    syncTokensActionsQueue.push("delete");
  }

  // If there is no background process to process all the syncTokenActions in
  // the queue, kick off the background process to process these, and save the
  // processing promise to handle de-duplication of calls to this function.
  if (syncTokensActionsQueueProcessingPromise === null) {
    syncTokensActionsQueueProcessingPromise = syncTokensActionQueueProcessor();
  }

  return syncTokensActionsQueueProcessingPromise;
}

/**
 * Process syncTokensActions in the queue until there is none left
 */
async function syncTokensActionQueueProcessor() {
  let pushNotificationTokens: PushNotificationTokens | null = null;

  // For as long as there is at least 1 item in the `syncTokensActionQueue` list
  // (check by seeing if last item in list is not undefined), we will take the
  // last action in the `syncTokensActionQueue` to execute it and delete the
  // rest of the actions in the queue. Here we can delete and ignore the other
  // actions in the queue because those are already "out of date" by the time
  // there is a new / latest action in the queue.
  while (
    syncTokensActionsQueue[syncTokensActionsQueue.length - 1] !== undefined
  ) {
    const currentSyncTokensAction =
      syncTokensActionsQueue[syncTokensActionsQueue.length - 1]!;

    // Delete the rest of the actions in the queue that is "out of date"
    syncTokensActionsQueue.length = 0;

    pushNotificationTokens = await getPushNotificationTokens();

    if (currentSyncTokensAction === "save") {
      await postSaveDevicePushNotificationTokens(pushNotificationTokens);
    } else {
      await postDeleteDevicePushNotificationTokens(pushNotificationTokens);
    }
  }

  // After processing all the syncTokenActions in the queue, clear the action
  // processing promise, so that this function can be called again to process
  // new items added to the queue later on.
  syncTokensActionsQueueProcessingPromise = null;

  // If for some reason the loop never ever runs, we will return the push
  // notification tokens directly instead of returning null.
  if (pushNotificationTokens === null) {
    return getPushNotificationTokens();
  }

  // Return newest push notification tokens available after the processing loop
  return pushNotificationTokens;
}
