// https://docs.expo.dev/router/installation/#custom-entry-point-to-initialize-and-load
// Using "index.tsx" instead of "expo-router/entry" in package.json "main" field
// to run this file so that we can load side-effects before the app loads the
// root layout (app/_layout.tsx)

/******************* Import side effects first and services *******************/
import TrackPlayer, {
  Event,
  IOSCategory,
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";

/**************************** Initialize services *****************************/
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

// Cant do top level await yet unforunately
// https://github.com/facebook/hermes/issues/1481
// await TrackPlayer.setupPlayer();
// @todo see all the options here
TrackPlayer.setupPlayer({
  iosCategory: IOSCategory.Playback,
});

// @todo see all the options here
TrackPlayer.updateOptions({
  // Media controls capabilities
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.Stop,
  ],

  // Android only: Capabilities shown when notification is in compact form
  compactCapabilities: [Capability.Play, Capability.Pause],

  android: {
    appKilledPlaybackBehavior: AppKilledPlaybackBehavior.PausePlayback,
  },
});

/****************** Register app entry through Expo Router ********************/
// This must be last to ensure all configurations are properly set up before the
// app renders.
// eslint-disable-next-line import/first
import "expo-router/entry";
