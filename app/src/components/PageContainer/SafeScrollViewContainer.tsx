import type { PropsWithChildren } from "react";
import type { RefreshControlProps } from "react-native";

import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBottomTabOverflow, useThemeColor } from "@/hooks";

/**
 * Use this as a top level page wrapper component. Do not wrap this as a child.
 */
export function SafeScrollViewContainer(
  props: PropsWithChildren<{
    refreshControl?: React.ReactElement<RefreshControlProps>;
  }>,
) {
  const bottomOverflow = useBottomTabOverflow();
  const backgroundColor = useThemeColor("background");
  const padding = 16;
  const paddingBottom = bottomOverflow > padding ? bottomOverflow : padding;

  return (
    // @todo Only do this when there is no Tab / Navigation header
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <ScrollView
        style={{
          // Fills full screen
          flex: 1,

          backgroundColor,
        }}
        contentContainerStyle={{
          // Inner fills but remains scrollable
          flexGrow: 1,

          // Add consistent spacing for all pages using this component
          padding,
          paddingBottom,
        }}
        scrollIndicatorInsets={{
          bottom: paddingBottom,
        }}
        refreshControl={props.refreshControl}

        // @todo Take as prop
        // keyboardShouldPersistTaps='handled'
      >
        {props.children}
      </ScrollView>
    </SafeAreaView>
  );
}
