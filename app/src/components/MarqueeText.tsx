import { Marquee } from "@animatereactnative/marquee";
import { type PropsWithChildren, useState } from "react";
import { View, ScrollView, type TextStyle } from "react-native";

import { ThemedText } from "./NewThemedText";

/**
 * @todo Publish as lib to reuse in the other apps
 * Wrapper around "@animatereactnative/marquee" `Marquee` with these differences
 * 1. Only works with text field. Text will be wrapped by `ThemedText`
 * 2. Only scroll the text if the text exceeds the container width
 * 3. Constrains marquee to container width instead of expanding to device width
 * 4. Supports delay before scrolling starts
 */
export function MarqueeText(
  props: PropsWithChildren<{
    /**
     * `key` is the same `key` property used by react to determine if something
     * should be re-rendered or not. This is not used internally, just added to
     * the type here to force users to attach a key, most probably the same as
     * the `text` field, to ensure that the UI will re-render when the `text`
     * field changes, to ensure that when changing from a long text that scrolls
     * to a shorter text that should not scroll, the scrolling should stop.
     */
    key: string;

    /**
     * Text to display and potentially scroll if it overflows the container
     */
    text: string;

    /**
     * Time delay before scrolling start, so that user's can have time to read
     * the text first before scrolling starts. If not specified, scrolling
     * starts immediately
     */
    delayInMsBeforeScrollStart?: number;

    /**
     * Number between 0-1 for how fast the scrolling should be. Defaults to 0.2
     */
    scrollSpeed?: number;

    /**
     * Number between 0-1 as a percentage of the container component to
     * determine how much space should there be between each scroll element.
     * Defaults to 0.2
     */
    scrollSpacingAsContainerWidthPercentage?: number;

    /**
     * Set styles for the inner `ThemedText` component as needed
     */
    textStyle?: TextStyle;
  }>,
) {
  const [parentWidth, setParentWidth] = useState<null | number>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  // Scroll speed is used to implement the "delay before scroll start" feature
  // by allowing the scrolling speed to be controlled from 0 -> actual
  // scrollSpeed instead of using hide/show for delaying scroll which will cause
  // UI flash/jank
  const [scrollSpeed, setScrollSpeed] = useState(0);

  return (
    <View onLayout={(e) => setParentWidth(e.nativeEvent.layout.width)}>
      {parentWidth !== null &&
        (shouldScroll ? (
          <View
            // Constrain it and hide overflows else the Marquee component will
            // expand to the whole screen width by default.
            style={{
              width: parentWidth,
              overflow: "hidden",
            }}
          >
            <Marquee
              // Scroll speed follows the internal state, to implement the
              // "delay before scroll start" feature by controlling the
              // scrolling speed from 0 -> actual scrollSpeed instead of using
              // hide/show for delaying scroll which will cause UI flash/jank
              speed={scrollSpeed}
              spacing={
                parentWidth *
                (props.scrollSpacingAsContainerWidthPercentage ?? 0.2)
              }
            >
              <ThemedText style={props.textStyle}>{props.text}</ThemedText>
            </Marquee>
          </View>
        ) : (
          // Using ScrollView to allow text to expand outwards so we can measure
          // the full width of the text
          <ScrollView
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          >
            <ThemedText
              style={props.textStyle}
              onLayout={(e) => {
                // Set state only if needed to prevent extra re-render
                if (e.nativeEvent.layout.width > parentWidth) {
                  setShouldScroll(true);

                  // Using scroll speed to implement delay before scroll start
                  setTimeout(
                    () => setScrollSpeed(props.scrollSpeed ?? 0.2),
                    props.delayInMsBeforeScrollStart,
                  );

                  // This technically works but causes UI flash/jank when the
                  // text component gets swapped out. Which is why the above
                  // scroll speed method is used to create the delay effect,
                  // which also have the added benefit of allowing users to
                  // manually scroll the text first before auto scrolling starts
                  // setTimeout(
                  //   () => setShouldScroll(true),
                  //   props.delayInMsBeforeScrollStart
                  // );
                }
              }}
            >
              {props.text}
            </ThemedText>
          </ScrollView>
        ))}
    </View>
  );
}
