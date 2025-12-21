/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import type { ThemeColorNames } from "@/constants";

import { ThemeColors } from "@/constants";

import { useTheme } from "./useTheme";

export function useThemeColor(
  colorName: ThemeColorNames,
  customColors?: { light?: string; dark?: string },
) {
  const theme = useTheme();
  const customColor = customColors?.[theme];
  return customColor ? customColor : ThemeColors[theme][colorName];
}
