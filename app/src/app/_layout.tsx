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

          // Using "containedTransparentModal" instead of "modal" or
          // "transparentModal" because this doesnt create a new native modal
          // view / creates a different type of native modal view that doesnt
          // break when creating more native modals with the "CommonModal" and
          // other routes that are also using "modal" presentation mode.
          presentation: useCardPlayerInsteadOfModal
            ? "card"
            : "containedTransparentModal",
        }}
      />
      <Stack.Screen
        name="track-queue-modal"
        options={{
          headerShown: false,

          // Using "containedTransparentModal" instead of "modal" or
          // "transparentModal" because this doesnt create a new native modal
          // view / creates a different type of native modal view that doesnt
          // break when creating more native modals with the "CommonModal" and
          // other routes that are also using "modal" presentation mode.
          presentation: useCardPlayerInsteadOfModal
            ? "card"
            : "containedTransparentModal",
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
