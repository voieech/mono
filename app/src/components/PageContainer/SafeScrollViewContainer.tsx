import type { PropsWithChildren } from "react";
import type { RefreshControlProps } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks";

import { ScrollViewContainer } from "./ScrollViewContainer";

/**
 * Use this as a top level page wrapper component. Do not wrap this as a child.
 */
export function SafeScrollViewContainer(
  props: PropsWithChildren<{
    refreshControl?: React.ReactElement<RefreshControlProps>;
  }>,
) {
  const backgroundColor = useThemeColor("background");

  return (
    // @todo Only do this when there is no Tab / Navigation header
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <ScrollViewContainer>{props.children}</ScrollViewContainer>
    </SafeAreaView>
  );
}
