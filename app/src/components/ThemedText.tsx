import { Text, type TextProps } from "react-native";
import { useThemeColor } from "@/hooks";

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
}) {
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });
  return (
    <Text
      style={[
        { color },
        type === "default" && {
          fontSize: 16,
          lineHeight: 24,
        },
        type === "defaultSemiBold" && {
          fontSize: 16,
          lineHeight: 24,
          fontWeight: "600",
        },
        type === "title" && {
          fontSize: 32,
          fontWeight: "bold",
          lineHeight: 32,
        },
        type === "subtitle" && {
          fontSize: 20,
          fontWeight: "bold",
        },
        type === "link" && {
          lineHeight: 30,
          fontSize: 16,
          color: "#0a7ea4",
        },
        style,
      ]}
      {...rest}
    />
  );
}
