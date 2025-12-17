import type { TextProps, StyleProp, TextStyle } from "react-native";

import { Text } from "react-native";

import { useThemeColor } from "@/hooks";

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
    fontWeight: "600",
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
  type,
  ...rest
}: TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TextTypes;
}) {
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });
  const textTypeStyle = type && TextTypeStyles[type];
  return (
    <Text
      style={[
        { color },
        // Always use default text style as the base for overriding
        TextTypeStyles.default,
        textTypeStyle,
        style,
      ]}
      {...rest}
    />
  );
}
