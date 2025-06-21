import { useActiveTrack } from "react-native-track-player";

import { isTrackWithMetadata } from "@/utils";

/**
 * Wrapper hook around `useActiveTrack` from RNTP to ensure that the Track
 * object is TrackWithMetadata type.
 */
export function useActiveTrackWithMetadata() {
  const activeTrack = useActiveTrack();

  if (activeTrack === undefined) {
    return;
  }

  if (!isTrackWithMetadata(activeTrack)) {
    throw new Error(`Track must contain meta data!`);
  }

  return activeTrack;
}
