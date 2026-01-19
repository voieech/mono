import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ViewProps & {
  lightColor?: string;
  darkColor?: string;
}) {
  const backgroundColor = useThemeColor("background", {
    light: lightColor,
    dark: darkColor,
  });
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
