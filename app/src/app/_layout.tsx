import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { AppRoot } from "@/AppRoot";
import { useExperimentalSurfaceContext } from "@/context";

function RootLayout() {
  const useCardPlayerInsteadOfModal =
    useExperimentalSurfaceContext().getShowExperimentalSurface(
      "use-card-player-instead-of-modal",
    );

  // Hide on the first time RootLayout is rendered, assuming that the moment
  // this root layout is rendered, all the initialisation / setup is done.
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,

          // Set to home so when the podcast episode page is opened via a
          // deep link, the back button says "Home"
          title: "Home",
        }}
      />
      <Stack.Screen
        name="audio-player-modal"
        options={{
          presentation: useCardPlayerInsteadOfModal ? "card" : "modal",

          // @todo
          // Try this to experiment with full screen mode, but need to
          // support swipe down to close.
          // presentation: "containedModal",
        }}
      />
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
