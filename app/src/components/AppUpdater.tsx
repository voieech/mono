import type { PropsWithChildren } from "react";

import * as ExpoUpdates from "expo-updates";
import { useEffect } from "react";

/**
 * Wrapper component to ensure that app is always running on latest version, and
 * if there is a newer version, download and update app before allowing user to
 * continue using.
 */
export function AppUpdater(props: PropsWithChildren) {
  // Temporarily disable OTA update code to prevent issue with first update.
  /* eslint-disable no-unreachable */
  return props.children;

  const updates = ExpoUpdates.useUpdates();

  useEffect(() => {
    async function update() {
      // @todo Skip if error found

      // Update is available and downloaded, apply it now
      if (updates.isUpdatePending) {
        await ExpoUpdates.reloadAsync();
      }

      // Update is available but not downloaded yet
      if (updates.isUpdateAvailable) {
        await ExpoUpdates.fetchUpdateAsync();
        await ExpoUpdates.reloadAsync();
      }
    }

    update();
  }, [updates.isUpdateAvailable, updates.isUpdatePending]);

  // @todo Handle errors
  // updates.checkError;
  // updates.downloadError;

  // For as long as there is a running check or pending update, wait until it is
  // complete before showing user the app.
  const pendingChecksOrUpdate =
    updates.isChecking ||
    updates.isDownloading ||
    updates.isRestarting ||
    updates.isUpdateAvailable ||
    updates.isUpdatePending;

  return pendingChecksOrUpdate ? null : props.children;
}
