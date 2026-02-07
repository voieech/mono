import type { PropsWithChildren } from "react";

import { Trans } from "@lingui/react/macro";
import { Pressable, useWindowDimensions, Modal } from "react-native";

import { Colors } from "@/constants";

import { Icon } from "./provided";
import { ThemedView, ThemedText } from "./ThemedComponents";
import { VerticalSpacer } from "./VerticalSpacer";

/**
 * Fullscreen Modal built using the native `Modal` component which translates to
 * a Modal in native UIs, but could potentially clash with expo-router
 * presentation: "modal" modes, which is why expo-router Stack.Screen components
 * should prefer "containedTransparentModal" presentation mode.
 */
export function CommonModal(
  props: PropsWithChildren<{
    /**
     * Should modal be shown
     */
    modalVisible: boolean;

    /**
     * Callback function called when user tries to close the modal
     */
    onClose: () => unknown;

    /**
     * Message to show user when closing modal. This is localised.
     */
    closeModalMessage?: "Cancel" | "Close";

    /**
     * How frosted do you want the background to be? Defaults to 2.
     */
    backgroundFrostedLevel?: 1 | 2 | 3;
  }>,
) {
  const windowDimensions = useWindowDimensions();
  const contentBoxMaxWidth = windowDimensions.width * 0.8;

  if (!props.modalVisible) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      visible={props.modalVisible}
      animationType={props.modalVisible ? "slide" : "fade"}
    >
      <Pressable
        onPress={props.onClose}
        style={{
          // 1. Cover the entire screen
          flex: 1,

          // 2. Center the children vertically and horizontally
          justifyContent: "center",
          alignItems: "center",

          // 3. Background styling, with a white "frosted" look
          backgroundColor: `rgba(255, 255, 255, 0.${1 + (props.backgroundFrostedLevel ?? 2)})`,
        }}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Pressable
            onPress={props.onClose}
            style={{
              width: "100%",
              alignSelf: "flex-end",
            }}
          >
            <ThemedView
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                columnGap: 8,
              }}
            >
              <ThemedText type="sm-normal" colorType="subtext">
                {(function () {
                  switch (props.closeModalMessage) {
                    case "Cancel":
                      return <Trans>Cancel</Trans>;
                    case "Close":
                    default:
                      return <Trans>Close</Trans>;
                  }
                })()}
              </ThemedText>
              <Icon name="xmark" color={Colors.neutral300} size={14} />
            </ThemedView>
          </Pressable>
          <VerticalSpacer height={2} />
          <ThemedView
            style={{
              padding: 24,
              borderRadius: 24,
              width: contentBoxMaxWidth,
              maxWidth: contentBoxMaxWidth,
            }}
          >
            {props.children}
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
