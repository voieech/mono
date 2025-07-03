import { useColorScheme } from "react-native";

import { isThemeFixed, DefaultTheme } from "@/constants/FixedTheme";

/**
 * Wrapper over native `useColorScheme` to always give a value back, defaulting
 * to light theme if unable to load a color scheme.
 */
export const useTheme = isThemeFixed
  ? () => DefaultTheme
  : () => useColorScheme() ?? DefaultTheme;
