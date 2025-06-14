import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView, type BlurTint } from "expo-blur";
import { StyleSheet } from "react-native";
import { isThemeFixed, DefaultTheme } from "@/constants/FixedTheme";

const blurTint: BlurTint = isThemeFixed
  ? DefaultTheme === "dark"
    ? "systemChromeMaterialDark"
    : "systemChromeMaterialLight"
  : // System chrome material automatically adapts to the system's theme
    // and matches the native tab bar appearance on iOS.
    "systemChromeMaterial";

export default function BlurTabBarBackground() {
  return (
    <BlurView tint={blurTint} intensity={100} style={StyleSheet.absoluteFill} />
  );
}

// The hook throws when there is no context, i.e. this hook is used in a
// component that isnt in a bottom tab navigator. Instead of throwing,
// default to 0
export function useBottomTabOverflow() {
  try {
    return useBottomTabBarHeight();
  } catch {
    return 0;
  }
}
