import type { PropsWithChildren } from "react";

import * as Clipboard from "expo-clipboard";
import { Pressable } from "react-native";

/**
 * Wrapper component to write string to user's clipboard when child component
 * is pressed.
 */
export function CopyOnPress(
  props: PropsWithChildren<{
    text: string;
    onCopy?: () => void;
  }>,
) {
  return (
    <Pressable
      onPress={async () => {
        await Clipboard.setStringAsync(props.text);
        props.onCopy?.();
      }}
    >
      {props.children}
    </Pressable>
  );
}
