import RNTPTrackPlayer, {
  RepeatMode,
  IOSCategory,
  Capability,
  AppKilledPlaybackBehavior,
  AndroidAudioContentType,
} from "react-native-track-player";

/* eslint-disable no-restricted-properties */
export async function setupReactNativeTrackPlayer() {
  RNTPTrackPlayer.registerPlaybackService(
    () =>
      async function () {
        console.log("RNTP PlaybackService registered");
      },
  );

  await RNTPTrackPlayer.setupPlayer({
    iosCategory: IOSCategory.Playback,
    androidAudioContentType: AndroidAudioContentType.Speech,
  });

  await RNTPTrackPlayer.updateOptions({
    // Android only: Capabilities shown when notification is in compact form
    compactCapabilities: [Capability.Play, Capability.Pause],

    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.PausePlayback,
    },
  });

  // By default, repeat mode should repeat entire queue
  await RNTPTrackPlayer.setRepeatMode(RepeatMode.Queue);
}
/* eslint-enable no-restricted-properties */
