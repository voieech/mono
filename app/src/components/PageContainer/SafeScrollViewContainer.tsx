import type { PropsWithChildren } from "react";
import type { RefreshControlProps } from "react-native";

import { SafeAreaViewContainer } from "./SafeAreaViewContainer";
import { ScrollViewContainer } from "./ScrollViewContainer";

/**
 * Use this as a top level page wrapper component. Do not wrap this as a child.
 */
export function SafeScrollViewContainer(
  props: PropsWithChildren<{
    refreshControl?: React.ReactElement<RefreshControlProps>;
  }>,
) {
  return (
    // @todo Only do this when there is no Tab / Navigation header
    <SafeAreaViewContainer>
      <ScrollViewContainer refreshControl={props.refreshControl}>
        {props.children}
      </ScrollViewContainer>
    </SafeAreaViewContainer>
  );
}
