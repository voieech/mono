/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants";

import { useTheme } from "./useTheme";

export function useThemeColor(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
  customColors?: { light?: string; dark?: string }
) {
  const theme = useTheme();
  const customColor = customColors?.[theme];
  return customColor ? customColor : Colors[theme][colorName];
}
