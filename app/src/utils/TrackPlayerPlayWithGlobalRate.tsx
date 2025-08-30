import TrackPlayer from "react-native-track-player";

import { settings, settingsInLocalStorage } from "./settings";
import { TrackPlayerPlaybackRateMap } from "./TrackPlayerPlaybackRates";

/**
 * Wrapper for `TrackPlayer.play` method that will also ensure that the playback
 * rate is set to the global playback rate setting value.
 */
export async function TrackPlayerPlayWithGlobalRate() {
  // eslint-disable-next-line no-restricted-properties
  await TrackPlayer.play();

  const localStorageSettings = await settingsInLocalStorage.read();

  const playbackRateString =
    localStorageSettings.defaultPlaybackSpeed ??
    settings.defaultPlaybackSpeed.defaultValue;

  const playbackRate = TrackPlayerPlaybackRateMap.get(playbackRateString) ?? 1;

  TrackPlayer.setRate(playbackRate);
}
