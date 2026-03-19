import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks";

/**
 * Use this as a customised SafeAreaView.
 *
 * This will ensure that SafeAreaView insets are only used when there is no
 * expo-router component header used. Since when headerShown is true, the safe
 * area padding inset is already handled for us and we want to avoid double
 * padding the container.
 */
export function SafeAreaViewContainer(
  props: PropsWithChildren<{
    style?: StyleProp<ViewStyle>;
  }>,
) {
  const backgroundColor = useThemeColor("background");
  const headerHeight = useHeaderHeight();
  const styles = [
    // Default styles
    {
      flex: 1,
      backgroundColor,
    },
    props.style,
  ];

  // If there is already a header height from the router component's
  // "headerShown" config, then just use a normal View component.
  if (headerHeight > 0) {
    return <View style={styles}>{props.children}</View>;
  }

  return <SafeAreaView style={styles}>{props.children}</SafeAreaView>;
}
