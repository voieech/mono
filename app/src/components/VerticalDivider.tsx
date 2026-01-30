import type { DimensionValue } from "react-native";

import { View } from "react-native";

import type { ColorValues } from "@/constants";

import { Colors } from "@/constants";

import { VerticalSpacer } from "./VerticalSpacer";

/**
 * Insert a vertical divider, i.e. a horizontal line between 2 components
 */
export function VerticalDivider(props?: {
  /**
   * Defaults to `Colors.neutral500`
   */
  lineColor?: ColorValues;
  /**
   * Defaults to 0.5px
   */
  lineHeight?: number;
  /**
   * Defaults to 8px for both. This takes precedence over `spaceBefore` and
   * `spaceAfter` props.
   */
  spaceBeforeAndAfter?: DimensionValue;
  /**
   * Defaults to 8px. The `spaceBeforeAndAfter` prop takes precedence over this.
   */
  spaceBefore?: DimensionValue;
  /**
   * Defaults to 8px. The `spaceBeforeAndAfter` prop takes precedence over this.
   */
  spaceAfter?: DimensionValue;
}) {
  return (
    <>
      <VerticalSpacer
        height={props?.spaceBeforeAndAfter ?? props?.spaceBefore}
      />
      <View
        style={{
          borderColor: Colors.neutral500,
          borderWidth: props?.lineHeight ?? 0.5,
        }}
      />
      <VerticalSpacer
        height={props?.spaceBeforeAndAfter ?? props?.spaceAfter}
      />
    </>
  );
}
