import { BlurView, type BlurTint } from "expo-blur";
import { StyleSheet } from "react-native";
import { isThemeFixed, DefaultTheme } from "@/constants";

const blurTint: BlurTint = isThemeFixed
  ? DefaultTheme === "dark"
    ? "systemChromeMaterialDark"
    : "systemChromeMaterialLight"
  : // System chrome material automatically adapts to the system's theme
    // and matches the native tab bar appearance on iOS.
    "systemChromeMaterial";

export function TabBarBackground() {
  return (
    <BlurView tint={blurTint} intensity={100} style={StyleSheet.absoluteFill} />
  );
}
