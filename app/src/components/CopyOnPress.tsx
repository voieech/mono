import type { MessageDescriptor } from "@lingui/core";
import type { PropsWithChildren } from "react";

import { msg } from "@lingui/core/macro";
import * as Clipboard from "expo-clipboard";
import { Pressable } from "react-native";

import { toast } from "@/utils";

/**
 * Wrapper component to write string to user's clipboard when child component
 * is pressed.
 */
export function CopyOnPress(
  props: PropsWithChildren<{
    /**
     * Text to copy to clipboard
     */
    text: string;
    /**
     * Set this to true if you do not want the default toast to be shown
     */
    doNotShowToastMessageOnCopy?: boolean;
    /**
     * Override the default toast message to show on copy
     */
    toastMessageToShowOnCopy?: string | MessageDescriptor;
    /**
     * Any other custom callback action to run
     */
    onCopy?: () => void;
  }>,
) {
  return (
    <Pressable
      onPress={async () => {
        await Clipboard.setStringAsync(props.text);
        props.onCopy?.();

        if (props.doNotShowToastMessageOnCopy !== true) {
          toast(
            props.toastMessageToShowOnCopy === undefined
              ? msg`Copied to clipboard`
              : props.toastMessageToShowOnCopy,
          );
        }
      }}
    >
      {props.children}
    </Pressable>
  );
}
