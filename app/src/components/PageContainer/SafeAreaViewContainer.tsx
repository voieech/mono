import type { PropsWithChildren } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks";

/**
 * Use this as a customised SafeAreaView
 */
export function SafeAreaViewContainer(props: PropsWithChildren) {
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
