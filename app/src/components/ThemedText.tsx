import type { TextProps, StyleProp, TextStyle } from "react-native";

import { useThemeColor } from "@/hooks";

import { ThemedText as NewThemedText } from "./NewThemedText";

type TextTypes = "default" | "semiBold" | "title" | "subtitle" | "link";

/**
 * All `TextTypes` other than `default` will get the `default` styles applied
 * first, so you only have to specify things to override `default` if needed and
 * dont have to repeat anything from `default`.
 */
const TextTypeStyles: Record<TextTypes, StyleProp<TextStyle>> = {
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  semiBold: {
    fontWeight: "semibold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    color: "#0a7ea4",
  },
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: TextProps & {
  lightColor?: string;
  darkColor?: string;
  type: TextTypes;
}) {
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });
  const textTypeStyle = type && TextTypeStyles[type];

  switch (type) {
    case "default":
      return (
        <NewThemedText
          type="base-normal"
          style={[{ color }, textTypeStyle, style]}
          {...rest}
        />
      );
    case "semiBold":
      return (
        <NewThemedText
          type="base-semibold"
          style={[{ color }, textTypeStyle, style]}
          {...rest}
        />
      );
    case "title":
      return (
        <NewThemedText
          type="xl-bold"
          style={[{ color }, textTypeStyle, style]}
          {...rest}
        />
      );
    case "subtitle":
      return (
        <NewThemedText
          type="lg-semibold"
          style={[{ color }, textTypeStyle, style]}
          {...rest}
        />
      );
    case "link":
      return (
        <NewThemedText
          type="base-normal"
          style={[{ color }, textTypeStyle, style]}
          {...rest}
        />
      );
    default:
      throw new Error("Invalid text type", type);
  }
}
