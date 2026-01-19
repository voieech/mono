import type { TextProps } from "react-native";

import { Colors } from "@/constants";
import { useThemeColor } from "@/hooks";

import { ThemedText } from "./ThemedText";

export function ThemedLink({
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
          color: Colors.sky400,
        },
        style,
      ]}
      {...rest}
    />
  );
}
