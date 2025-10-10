import { createContext } from "react";

import type { TrackWithMetadata } from "@/utils";

import { createUseContextHook } from "@/utils";

export const TrackPlayerContext = createContext<{
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
}>(
  // @ts-expect-error
  null,
);

export const useTrackPlayer = createUseContextHook(
  TrackPlayerContext,
  "TrackPlayerContext",
);
