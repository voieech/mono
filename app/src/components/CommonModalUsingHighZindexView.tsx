import type { PropsWithChildren } from "react";

import { Trans } from "@lingui/react/macro";
import {
  useWindowDimensions,
  Dimensions,
  Pressable,
  View,
  Platform,
} from "react-native";
// import RootSibling from "react-native-root-siblings";
import { RootSiblingPortal } from "react-native-root-siblings";

import { ThemedView, ThemedText, Icon, VerticalSpacer } from "@/components";
import { Colors } from "@/constants";

/**
 * Fullscreen Modal built using a high zIndex `View` component. This is so that
 * we dont rely on the native `Modal` component which translates to a Modal in
 * native UIs which clashes with expo-router presentation: "modal" modes.
 *
 * Placement: For this to work reliably across all navigation routes, render
 * this as the last child within your top-level View or Stack.Screen to ensure
 * it naturally has the highest stacking index in the React Native view tree.
 */
export function CommonModalUsingHighZindexView(
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

  // Using Dimensions.get('screen') ensures you cover the status bar and notch
  // area on Android
  const screenHeight = Dimensions.get("screen").height;

  if (!props.modalVisible) {
    return null;
  }

  return (
    <RootSiblingPortal>
      <View
        style={{
          // Replaces the non-existent absoluteFillObject
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,

          // Force dimensions to match the actual physical screen
          width: windowDimensions.width,
          height:
            Platform.OS === "android" ? screenHeight : windowDimensions.height,

          zIndex: 1000,
          // zIndex: 9999,

          // Required for Android layering
          // On Android, zIndex alone sometimes fails; you must also provide an
          // elevation value higher than any other surrounding components to
          // ensure it stays on top.
          elevation: 10,
        }}
        // This ensures screen readers screen readers treat this as a modal and
        // that the user should be restricted to the content inside this view
        // only.
        accessibilityViewIsModal={true}
        // This ensures that clicks are captured by the modal and don't "pass
        // through" to components underneath, which is important for z-stacking
        // order.
        pointerEvents="auto"
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
      </View>
    </RootSiblingPortal>
  );
}
