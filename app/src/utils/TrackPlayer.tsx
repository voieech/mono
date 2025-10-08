import RNTPTrackPlayer from "react-native-track-player";

import { posthog } from "./posthog";
import { settings, settingsInLocalStorage } from "./settings";
import { TrackPlayerPlaybackRateMap } from "./TrackPlayerPlaybackRates";
import { trackQueue } from "./TrackQueue";
import { TrackWithMetadata } from "./TrackWithMetadata";

/**
 * Wrapper around the TrackPlayer from "react-native-track-player".
 */
export const TrackPlayer = {
  queue: trackQueue,

  /**
   * 1. Start playing audio / current track
   * 1. Ensures that player is using the global playback rate
   * 1. Make sure the track queue current position is updated
   * 1. Track play event with posthog
   */
  async play() {
    // eslint-disable-next-line no-restricted-properties
    await RNTPTrackPlayer.play();

    const localStorageSettings = await settingsInLocalStorage.read();

    const playbackRateString =
      localStorageSettings.playbackRate ?? settings.playbackRate.defaultValue;

    const playbackRate =
      TrackPlayerPlaybackRateMap.get(playbackRateString) ?? 1;

    await RNTPTrackPlayer.setRate(playbackRate);

    // Make sure the current position is up to date
    this.queue.updateCurrentPosition();

    const activeTrack = (await RNTPTrackPlayer.getActiveTrack()) as
      | TrackWithMetadata
      | undefined;

    if (activeTrack === undefined) {
      return;
    }

    posthog.capture("track_playback", {
      id: activeTrack.id,
      type: activeTrack.trackType,
      locale: activeTrack.locale,
      playbackRate,
    });
  },

  async pause() {
    // eslint-disable-next-line no-restricted-properties
    await RNTPTrackPlayer.pause();
  },

  /**
   * 1. Filter out tracks that are already in the queue.
   * 1. Enqueue filtered track(s) right after the current track.
   * 1. Ensure track queue and current position is updated.
   */
  async enqueueTracksAfterCurrent(tracks: Array<TrackWithMetadata>) {
    const currentTracks = this.queue.getAllTracks();
    const currentTracksSet = new Set(currentTracks.map((track) => track.id));
    const filteredTracks = tracks.filter(
      (track) => !currentTracksSet.has(track.id),
    );

    // Add it to index 1, to be the next in line after the current track
    await RNTPTrackPlayer.add(filteredTracks, 1);

    await Promise.all([
      this.queue.updateCurrentPosition(),
      this.queue.updateTracks(),
    ]);
  },
};
