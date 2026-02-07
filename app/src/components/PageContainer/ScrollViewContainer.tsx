import type { PropsWithChildren } from "react";
import type { RefreshControlProps, ScrollViewProps } from "react-native";

import { ScrollView } from "react-native";

import { useBottomTabOverflow, useThemeColor } from "@/hooks";

/**
 * Use this as a customised ScrollView
 */
export function ScrollViewContainer(
  props: PropsWithChildren<{
    refreshControl?: React.ReactElement<RefreshControlProps>;
    onScroll?: ScrollViewProps["onScroll"];
  }>,
) {
  const bottomOverflow = useBottomTabOverflow();
  const backgroundColor = useThemeColor("background");
  const padding = 16;
  const paddingBottom = bottomOverflow > padding ? bottomOverflow : padding;

  return (
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
      onScroll={props.onScroll}

      // @todo Take as prop
      // keyboardShouldPersistTaps='handled'
    >
      {props.children}
    </ScrollView>
  );
}
