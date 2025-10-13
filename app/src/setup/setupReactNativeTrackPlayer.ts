import RNTPTrackPlayer, {
  IOSCategory,
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";

export async function setupReactNativeTrackPlayer() {
  RNTPTrackPlayer.registerPlaybackService(
    () =>
      async function playbackService() {
        console.log("RNTP PlaybackService registered");
      },
  );

  // @todo see all the options here
  await RNTPTrackPlayer.setupPlayer({
    iosCategory: IOSCategory.Playback,
  });

  RNTPTrackPlayer.updateOptions({
    // Android only: Capabilities shown when notification is in compact form
    compactCapabilities: [Capability.Play, Capability.Pause],

    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.PausePlayback,
    },
  });
}
