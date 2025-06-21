import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  AppDebuggingSurfaceProvider,
  ExperimentalSurfaceProvider,
} from "@/components";
import { useTheme } from "@/hooks";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set these options to ensure that once data is loaded and cached it will
      // never be refetched again automatically.
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,

      // Dont retry on failure, this assumes that things wont be automatically
      // fixed after just waiting a few seconds
      retry: false,
    },
  },
});

export default function RootLayout() {
  const theme = useTheme();
  const [isFontLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
                    presentation: "modal",

                    // @todo
                    // Try this to experiment with full screen mode, but need to
                    // support swipe down to close.
                    // presentation: "containedModal",
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ExperimentalSurfaceProvider>
          </AppDebuggingSurfaceProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
