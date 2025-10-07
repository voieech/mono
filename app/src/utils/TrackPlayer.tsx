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
   * Wrapper for `RNTPTrackPlayer.play` method that will also ensure that the
   * playback rate is set to the global playback rate setting value.
   */
  async playWithGlobalRate() {
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
};
