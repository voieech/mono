/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import type { ColorNames } from "@/constants";

import { Colors } from "@/constants";

import { useTheme } from "./useTheme";

export function useThemeColor(
  colorName: ColorNames,
  customColors?: { light?: string; dark?: string },
) {
  const theme = useTheme();
  const customColor = customColors?.[theme];
  return customColor ? customColor : Colors[theme][colorName];
}
