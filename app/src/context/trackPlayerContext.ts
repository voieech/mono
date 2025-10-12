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
  /**
   * This will either go to the next track and start playing.
   */
  goToNextTrack: () => Promise<void>;
  /**
   * This will either go to start of track or to the previous track and start
   * playing, see `rewindToStartOnSkipPrevious` setting.
   */
  goToPreviousOrStartOfTrack: () => Promise<void>;
  /**
   * Playback rate of the current track. This rate is persisted across use in
   * settings.
   */
  playbackRate: number;
  /**
   * Update the playback rate and save it to settings.
   */
  updatePlaybackRateByCycling: () => Promise<void>;

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
