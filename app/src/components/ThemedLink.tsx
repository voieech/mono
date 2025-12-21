import type { TextProps } from "react-native";

import { useThemeColor } from "@/hooks";

import { ThemedText } from "./NewThemedText";

export function OldThemedLink({
  style,
  lightColor,
  darkColor,
  type,
  ...rest
}: TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: string;
}) {
  // @todo use from Colors constant and get it passed in
  const _color = useThemeColor("text", { light: lightColor, dark: darkColor });
  return (
    <ThemedText
      type={type as any}
      style={[
        {
          color: "#0a7ea4",
        },
        style,
      ]}
      {...rest}
    />
  );
}
