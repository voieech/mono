import type { PropsWithChildren } from "react";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  AppDebuggingSurfaceProvider,
  ExperimentalSurfaceProvider,
} from "@/components";
import { useTheme } from "@/hooks";
import { queryClient } from "@/utils";

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
        <GestureHandlerRootView
          style={{
            flex: 1,
          }}
        >
          <AppDebuggingSurfaceProvider>
            <ExperimentalSurfaceProvider>
              <StatusBar style="auto" />
              {props.children}
            </ExperimentalSurfaceProvider>
          </AppDebuggingSurfaceProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
