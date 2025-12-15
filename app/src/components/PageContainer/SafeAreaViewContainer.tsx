import type { PropsWithChildren } from "react";
import type { RefreshControlProps } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks";

/**
 * Use this as a customised SafeAreaView
 */
export function SafeAreaViewContainer(
  props: PropsWithChildren<{
    refreshControl?: React.ReactElement<RefreshControlProps>;
  }>,
) {
  const backgroundColor = useThemeColor("background");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      {props.children}
    </SafeAreaView>
  );
}
