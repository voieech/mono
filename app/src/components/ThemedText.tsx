import type { TextProps, StyleProp, TextStyle } from "react-native";

import { Text } from "react-native";

import { useThemeColor } from "@/hooks";

type TextTypes = "default" | "semiBold" | "title" | "subtitle" | "link";

export const TextTypeStyles: Record<TextTypes, StyleProp<TextStyle>> = {
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  semiBold: {
    fontSize: 16,
    lineHeight: 24,
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
    fontSize: 16,
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
  type?: TextTypes;
}) {
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });
  const textTypeStyle = TextTypeStyles[type];
  return <Text style={[{ color }, textTypeStyle, style]} {...rest} />;
}
