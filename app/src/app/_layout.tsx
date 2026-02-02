import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { AppRoot } from "@/AppRoot";
import { useSettingContext, useExperimentalSurfaceContext } from "@/context";

import Welcome from "./welcome";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function RootLayout() {
  const settingContext = useSettingContext();
  const useCardPlayerInsteadOfModal =
    useExperimentalSurfaceContext().getShowExperimentalSurface(
      "use-card-player-instead-of-modal",
    );

  // Hide on the first time RootLayout is rendered, assuming that the moment
  // this root layout is rendered, all the initialisation / setup is done.
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  if (settingContext.getSetting("lastOnboardingTime") === "") {
    return <Welcome />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          // Set to home so when the podcast episode page is opened via a
          // deep link, the back button says "Home"
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="audio-player-modal"
        options={{
          headerShown: false,
          presentation: useCardPlayerInsteadOfModal ? "card" : "modal",

          // @todo
          // Try this to experiment with full screen mode, but need to
          // support swipe down to close.
          // presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="track-queue-modal"
        options={{
          headerShown: false,
          presentation: useCardPlayerInsteadOfModal ? "card" : "modal",
        }}
      />
      {__DEV__ && (
        <Stack.Screen
          name="themed-text-test"
          options={{
            presentation: "modal",
          }}
        />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function WrappedRootLayout() {
  return (
    <AppRoot>
      <RootLayout />
    </AppRoot>
  );
}
