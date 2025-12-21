import type { TextProps, StyleProp, TextStyle } from "react-native";

import { Text } from "react-native";

import { useThemeColor } from "@/hooks";

type FontSizes = "xl" | "lg" | "base" | "sm" | "xs";
const FontSize: Record<FontSizes, TextStyle["fontSize"]> = {
  xl: 32,
  lg: 24,
  base: 16,
  sm: 14,
  xs: 10,
};

type FontWeights = "black" | "bold" | "semibold" | "normal" | "light" | "thin";
const FontWeight: Record<FontWeights, TextStyle["fontWeight"]> = {
  black: 900,
  bold: 700,
  semibold: 500,
  normal: 400,
  light: 300,
  thin: 200,
};

type TextTypes = `${FontSizes}-${FontWeights}`;

const TextTypeStyles: Record<TextTypes, StyleProp<TextStyle>> = {
  "xl-black": {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
  },
  "xl-bold": {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  "xl-semibold": {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
  },
  "xl-normal": {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.normal,
  },
  "xl-light": {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.light,
  },
  "xl-thin": {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.thin,
  },
  "lg-black": {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.black,
  },
  "lg-bold": {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  "lg-semibold": {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  "lg-normal": {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.normal,
  },
  "lg-light": {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.light,
  },
  "lg-thin": {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.thin,
  },
  "base-black": {
    fontSize: FontSize.base,
    fontWeight: FontWeight.black,
  },
  "base-bold": {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  "base-semibold": {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  "base-normal": {
    fontSize: FontSize.base,
    fontWeight: FontWeight.normal,
  },
  "base-light": {
    fontSize: FontSize.base,
    fontWeight: FontWeight.light,
  },
  "base-thin": {
    fontSize: FontSize.base,
    fontWeight: FontWeight.thin,
  },
  "sm-black": {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.black,
  },
  "sm-bold": {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  "sm-semibold": {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  "sm-normal": {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.normal,
  },
  "sm-light": {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.light,
  },
  "sm-thin": {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.thin,
  },
  "xs-black": {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.black,
  },
  "xs-bold": {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  "xs-semibold": {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  "xs-normal": {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.normal,
  },
  "xs-light": {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.light,
  },
  "xs-thin": {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.thin,
  },
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "base-normal",
  // @todo limit the style prop passed in
  ...rest
}: TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TextTypes;
}) {
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });
  const textTypeStyle = TextTypeStyles[type];
  return <Text style={[{ color }, textTypeStyle, style]} {...rest} />;
}
