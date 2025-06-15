import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useColorScheme } from "react-native";

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
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,

              // Set to home so when the podcast episode page is opened via a
              // deep link, the back button says "Home"
              title: "Home",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
