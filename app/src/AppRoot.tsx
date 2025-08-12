import type { PropsWithChildren } from "react";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from "posthog-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  AppDebuggingSurfaceProvider,
  ExperimentalSurfaceProvider,
  SettingsProvider,
  WelcomeProvider,
} from "@/components";
import { useTheme } from "@/hooks";
import { queryClient, posthog } from "@/utils";

// Dont auto hide the splash screen until all initialisation steps are done
SplashScreen.preventAutoHideAsync();

// Fade out the splash screen on IOS instead of immediately hiding it to prevent
// the UI from looking very janky.
SplashScreen.setOptions({
  fade: true,
});

/**
 * Handles initialisation and all the root providers. Expects child to be root
 * layout file.
 */
export function AppRoot(props: PropsWithChildren) {
  const theme = useTheme();
  const [isFontLoaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Wait for font to load. This should not run in production as async font
  // loading only occurs in development.
  if (!isFontLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        {/*
          PostHogProvider adds a new build warning:
          Using outdated JSX transform https://react.dev/link/new-jsx-transform
        */}
        <PostHogProvider
          client={posthog}
          autocapture={{
            captureScreens: true,
            captureTouches: true,

            // Add this if not in navigation container
            // https://github.com/PostHog/posthog-js-lite/pull/455
            // import { createNavigationContainerRef } from "@react-navigation/native";
            // const navigationRef = createNavigationContainerRef();
            // navigationRef,
          }}
        >
          <GestureHandlerRootView
            style={{
              flex: 1,
            }}
          >
            <AppDebuggingSurfaceProvider>
              <ExperimentalSurfaceProvider>
                <SettingsProvider>
                  <WelcomeProvider>
                    <StatusBar style="auto" />
                    {props.children}
                  </WelcomeProvider>
                </SettingsProvider>
              </ExperimentalSurfaceProvider>
            </AppDebuggingSurfaceProvider>
          </GestureHandlerRootView>
        </PostHogProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
