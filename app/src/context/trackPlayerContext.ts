import { createContext } from "react";

import type { TrackWithMetadata } from "@/utils";

import { createUseContextHook } from "@/utils";

export const TrackPlayerContext = createContext<{
  pause: () => Promise<void>;
  /**
   * 1. Start playing audio / current track
   * 1. Ensures that player is using the global playback rate
   * 1. Make sure the track queue current position is updated
   * 1. Track play event with posthog
   */
  play: () => Promise<void>;
  /**
   * 1. Filter out tracks that are already in the queue.
   * 1. Enqueue filtered track(s) right after the current track.
   * 1. Ensure track queue and current position is updated.
   */
  enqueueTracksAfterCurrent: (
    tracks: Array<TrackWithMetadata>,
  ) => Promise<void>;

  /****************************** Queue related *******************************/
  currentPosition: number;
  tracks: ReadonlyArray<TrackWithMetadata>;
  getTracksBehind: () => ReadonlyArray<TrackWithMetadata>;
  getTracksBehindWithCurrentTrack: () => ReadonlyArray<TrackWithMetadata>;
  getTracksAhead: () => ReadonlyArray<TrackWithMetadata>;
  getTracksAheadWithCurrentTrack: () => ReadonlyArray<TrackWithMetadata>;
  /**
   * Sync queue position with source of truth
   */
  updateCurrentPosition: () => void;
  /**
   * Sync queue with source of truth
   */
  updateTracks: () => void;
  /**
   * Removes all upcoming tracks from queue
   */
  removeUpcomingTracks: () => Promise<void>;
}>(
  // @ts-expect-error
  null,
);

export const useTrackPlayer = createUseContextHook(
  TrackPlayerContext,
  "TrackPlayerContext",
);
