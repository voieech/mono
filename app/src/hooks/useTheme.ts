/**
 * Wrapper over native `useColorScheme` to always give a value back, defaulting
 * to light theme if unable to load a color scheme.
 */

import { useColorScheme } from "react-native";

import { isThemeFixed, DefaultTheme } from "@/constants/FixedTheme";

export function useTheme() {
  const colorScheme = useColorScheme() ?? DefaultTheme;

  if (isThemeFixed) {
    return DefaultTheme;
  }

  return colorScheme;
}
