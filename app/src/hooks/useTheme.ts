/**
 * Wrapper over native `useColorScheme` to always give a value back, defaulting
 * to light theme if unable to load a color scheme.
 */

import { useColorScheme } from "react-native";

export function useTheme() {
  return useColorScheme() ?? "light";
}
