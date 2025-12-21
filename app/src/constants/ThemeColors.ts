import type { ColorValues } from "./Colors";
import type { Theme } from "./Theme";

import { Colors } from "./Colors";

type ThemeColor = {
  text: ColorValues;
  subtext: ColorValues;
  background: ColorValues;
  tint: ColorValues;
  icon: ColorValues;
  tabIconDefault: ColorValues;
  tabIconSelected: ColorValues;
};

/**
 * App UI component specific colors split by theme.
 */
export const ThemeColors = {
  light: {
    text: Colors.gray950,
    subtext: Colors.gray950,
    background: Colors.white,
    tint: Colors.cyan500,
    icon: Colors.gray500,
    tabIconDefault: Colors.gray500,
    tabIconSelected: Colors.cyan500,
  },
  dark: {
    text: Colors.neutral50,
    subtext: Colors.neutral300,
    background: Colors.neutral900,
    tint: Colors.white,
    icon: Colors.neutral500,
    tabIconDefault: Colors.neutral400,
    tabIconSelected: Colors.white,
  },
} as const satisfies Record<Theme, ThemeColor>;

export type ThemeColorNames = keyof ThemeColor;

export type ThemeTextColorNames = Extract<ThemeColorNames, `${string}text`>;
