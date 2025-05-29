import TrackPlayer, {
  Event,
  IOSCategory,
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";

export async function setupReactNativeTrackPlayer() {
  TrackPlayer.registerPlaybackService(
    () =>
      async function playbackService() {
        TrackPlayer.addEventListener(Event.RemotePlay, () => {
          console.log("RNTP Event.RemotePlay");
          TrackPlayer.play();
        });

        TrackPlayer.addEventListener(Event.RemotePause, () => {
          console.log("RNTP Event.RemotePause");
          TrackPlayer.pause();
        });

        TrackPlayer.addEventListener(Event.RemoteStop, () => {
          console.log("RNTP Event.RemoteStop");
          TrackPlayer.stop();
        });

        TrackPlayer.addEventListener(Event.RemoteJumpForward, (e) => {
          console.log("RNTP Event.RemoteJumpForward");
          TrackPlayer.seekBy(e.interval);
        });

        TrackPlayer.addEventListener(Event.RemoteJumpBackward, (e) => {
          console.log("RNTP Event.RemoteJumpBackward");
          TrackPlayer.seekBy(-e.interval);
        });

        TrackPlayer.addEventListener(Event.RemoteSeek, (e) => {
          console.log("RNTP Event.RemoteSeek");
          TrackPlayer.seekTo(e.position);
        });

        TrackPlayer.addEventListener(Event.RemotePrevious, () => {
          console.log("RNTP Event.RemotePrevious");
          // Conditionally execute either one of this based on current playback
          // position.
          // TrackPlayer.skipToPrevious();
          TrackPlayer.seekTo(0);
        });

        // @todo do nothing if no next? Or loop back?
        TrackPlayer.addEventListener(Event.RemoteNext, () => {
          console.log("RNTP Event.RemoteNext");
          TrackPlayer.skipToNext();
        });

        console.log("RNTP PlaybackService registered");
      }
  );

  // @todo see all the options here
  await TrackPlayer.setupPlayer({
    iosCategory: IOSCategory.Playback,
  });

  // @todo see all the options here
  TrackPlayer.updateOptions({
    // Media controls capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,

      // @todo Add setting for user to configure which do they prefer
      // ...[Capability.SkipToNext, Capability.SkipToPrevious],
      ...[Capability.JumpForward, Capability.JumpBackward, Capability.SeekTo],
    ],

    // Android only: Capabilities shown when notification is in compact form
    compactCapabilities: [Capability.Play, Capability.Pause],

    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.PausePlayback,
    },
  });
}
