// https://docs.expo.dev/router/installation/#custom-entry-point-to-initialize-and-load
// Using "index.tsx" instead of "expo-router/entry" in package.json "main" field
// to run this file so that we can load side-effects before the app loads the
// root layout (app/_layout.tsx)

/******************* Import side effects first and services *******************/
// Polyfill Intl.PluralRules as React Native JS engine doesnt support it yet
// https://formatjs.github.io/docs/polyfills/intl-locale
import "@formatjs/intl-locale/polyfill";
// Polyfill Intl.PluralRules as React Native JS engine doesnt support it yet
// https://formatjs.github.io/docs/polyfills/intl-pluralrules/#react-native
// Forcing polyfill since polyfill conditional detection code runs very slowly
// on Android and can slow down your app's startup time by seconds.
import "@formatjs/intl-pluralrules/polyfill-force";
import "@formatjs/intl-pluralrules/locale-data/en";

import { setupReactNativeTrackPlayer } from "@/setup";
import { dynamicallyLoadAndActivateLocale } from "@/utils";

/**************************** Initialize services *****************************/
// Cant do top level await yet unforunately
// https://github.com/facebook/hermes/issues/1481
// await setupReactNativeTrackPlayer();
setupReactNativeTrackPlayer();

// Lingui's I18nProvider will not render its child components until a current
// locale is set, which is why we dont need to await this.
dynamicallyLoadAndActivateLocale();

/****************** Register app entry through Expo Router ********************/
// This must be last to ensure all configurations are properly set up before the
// app renders.
// eslint-disable-next-line import/first
import "expo-router/entry";
