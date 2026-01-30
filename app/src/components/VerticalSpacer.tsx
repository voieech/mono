import type { DimensionValue } from "react-native";

import { View } from "react-native";

/**
 * Insert a vertical space between components
 */
export function VerticalSpacer(props?: {
  /**
   * Defaults to 8px
   */
  height?: DimensionValue;
}) {
  return (
    <View
      style={{
        paddingVertical: props?.height ?? 8,
      }}
    />
  );
}
