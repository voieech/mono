import type { PropsWithChildren } from "react";

import { Trans } from "@lingui/react/macro";
import { Pressable, useWindowDimensions, Modal } from "react-native";

import { ThemedView, ThemedText, Icon, VerticalSpacer } from "@/components";
import { Colors } from "@/constants";

/**
 * Fullscreen Modal
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
     * How frosted do you want the background to be? Defaults to 2.
     */
    backgroundFrostedLevel?: 1 | 2 | 3;
  }>,
) {
  const windowDimensions = useWindowDimensions();
  const contentBoxMaxWidth = windowDimensions.width * 0.8;

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
                <Trans>Cancel</Trans>
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
