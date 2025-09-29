import RNTPTrackPlayer, {
  Event,
  IOSCategory,
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";

import { capabilitiesWithJump } from "@/utils/ReactNativeTrackPlayerCapabilitiesOptions";
import { TrackPlayer } from "@/utils/TrackPlayer";

export async function setupReactNativeTrackPlayer() {
  RNTPTrackPlayer.registerPlaybackService(
    () =>
      async function playbackService() {
        RNTPTrackPlayer.addEventListener(Event.RemotePlay, () =>
          TrackPlayer.playWithGlobalRate(),
        );

        RNTPTrackPlayer.addEventListener(Event.RemotePause, () =>
          TrackPlayer.pause(),
        );

        RNTPTrackPlayer.addEventListener(Event.RemoteStop, () =>
          RNTPTrackPlayer.stop(),
        );

        RNTPTrackPlayer.addEventListener(Event.RemoteJumpForward, (e) =>
          RNTPTrackPlayer.seekBy(e.interval),
        );

        RNTPTrackPlayer.addEventListener(
          Event.RemoteJumpBackward,
          async (e) => {
            const progress = await RNTPTrackPlayer.getProgress();
            if (progress.position < e.interval) {
              RNTPTrackPlayer.seekTo(0);
              return;
            }

            RNTPTrackPlayer.seekBy(-e.interval);
          },
        );

        RNTPTrackPlayer.addEventListener(Event.RemoteSeek, (e) =>
          RNTPTrackPlayer.seekTo(e.position),
        );

        RNTPTrackPlayer.addEventListener(Event.RemotePrevious, () => {
          // Conditionally execute either one of this based on current playback
          // position.
          // TrackPlayer.skipToPrevious();
          RNTPTrackPlayer.seekTo(0);
        });

        // @todo do nothing if no next? Or loop back?
        RNTPTrackPlayer.addEventListener(Event.RemoteNext, () => {
          RNTPTrackPlayer.skipToNext();
        });

        console.log("RNTP PlaybackService registered");
      },
  );

  // @todo see all the options here
  await RNTPTrackPlayer.setupPlayer({
    iosCategory: IOSCategory.Playback,
  });

  RNTPTrackPlayer.updateOptions({
    // @todo Read past settings instead of always setting to default value
    capabilities: capabilitiesWithJump,

    // Android only: Capabilities shown when notification is in compact form
    compactCapabilities: [Capability.Play, Capability.Pause],

    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.PausePlayback,
    },
  });
}
