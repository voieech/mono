import type { PropsWithChildren, ReactElement } from "react";
import { useWindowDimensions, type ViewProps } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useTheme } from "@/hooks/useTheme";

export function ParallaxScrollView(
  props: PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor?: { dark?: string; light?: string };

    /**
     * Use the device width as headerImage height. Set to true if you want to
     * support square images.
     */
    headerHeightUseWidth?: boolean;

    /**
     * Optionally override the default headerHeight (250 px) to an arbitrary
     * number. This will only be used if `headerHeightUseWidth` is not set to
     * `true`.
     */
    headerHeight?: number;

    /**
     * Allow users to set custom styling on the inner content wrapper instead of
     * having to wrap their content in `ThemedView` or `View` again before they
     * can apply styles.
     */
    innerContentStyle?: ViewProps["style"];
  }>
) {
  const colorScheme = useTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const { width } = useWindowDimensions();
  const headerHeight = props.headerHeightUseWidth
    ? width
    : props.headerHeight ?? 250;
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [2, 1, 1]
          ),
        },
      ],
    };
  });
  const headerImageBackgroundColor =
    props.headerBackgroundColor?.[colorScheme] ??
    { light: "#D0D0D0", dark: "#353636" }[colorScheme];

  return (
    <ThemedView
      style={{
        flex: 1,
      }}
    >
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Animated.View
          style={[
            {
              height: headerHeight,
              backgroundColor: headerImageBackgroundColor,
              overflow: "hidden",
            },
            headerAnimatedStyle,
          ]}
        >
          {props.headerImage}
        </Animated.View>

        {/* Wrapped for default background color and allow users to set style */}
        <ThemedView
          style={[
            // Apply default styles first before letting user styles override.
            {
              padding: 16,
            },
            props.innerContentStyle,
          ]}
        >
          {props.children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}
