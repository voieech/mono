// https://docs.expo.dev/router/installation/#custom-entry-point-to-initialize-and-load
// Using "index.tsx" instead of "expo-router/entry" in package.json "main" field
// to run this file so that we can load side-effects before the app loads the
// root layout (app/_layout.tsx)

/******************* Import side effects first and services *******************/
import { setupReactNativeTrackPlayer } from "./setup/setupReactNativeTrackPlayer";

/**************************** Initialize services *****************************/
// Cant do top level await yet unforunately
// https://github.com/facebook/hermes/issues/1481
// await setupReactNativeTrackPlayer();
setupReactNativeTrackPlayer();

/****************** Register app entry through Expo Router ********************/
// This must be last to ensure all configurations are properly set up before the
// app renders.
// eslint-disable-next-line import/first
import "expo-router/entry";
