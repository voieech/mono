import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
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
