import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { useWindowDimensions, Pressable } from "react-native";

import { Colors } from "@/constants";
import { useAuthContext } from "@/context";

import { Icon } from "./provided";
import { ThemedView, ThemedText } from "./ThemedComponents";
import { VerticalSpacer } from "./VerticalSpacer";

/**
 * Common auth card component used in auth walls/modals for the "Sign in to
 * continue" flow.
 */
export function SigninToContinueCard(props: {
  /**
   * Callback to run if user presses the cancellation button. The cancellation
   * button will only be shown if a onCancel callback is passed in.
   */
  onCancel?: () => unknown;
  /**
   * Callback called when user successfully login
   */
  onLoginSuccess?: () => unknown;
}) {
  const authContext = useAuthContext();
  const windowDimensions = useWindowDimensions();
  const contentBoxMaxWidth = windowDimensions.width * 0.8;

  return (
    <>
      {props.onCancel !== undefined && (
        <>
          <Pressable
            onPress={props.onCancel}
            style={{
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
        </>
      )}
      <ThemedView
        style={{
          flexDirection: "column",
          rowGap: 24,
          padding: 24,
          borderRadius: 24,
          maxWidth: contentBoxMaxWidth,
        }}
      >
        <ThemedView>
          <ThemedText
            type="xl-light"
            style={{
              paddingBottom: 4,
            }}
          >
            <Trans>Sign In to Continue</Trans>
          </ThemedText>
          <ThemedText type="base-light" colorType="subtext">
            <Trans>
              Get access to exclusive member only features right now!
            </Trans>
          </ThemedText>
        </ThemedView>
        <Pressable
          onPress={() =>
            authContext.login({
              onLoginSuccess: props.onLoginSuccess,
            })
          }
        >
          <ThemedView
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              columnGap: 8,
              justifyContent: "space-between",
              backgroundColor: Colors.black,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 16,
            }}
          >
            <Image
              source={require("@/assets/images/icon-dark.png")}
              style={{
                width: 36,
                aspectRatio: 1,
                borderRadius: 8,
              }}
              contentFit="cover"
            />
            <ThemedText type="lg-light">
              <Trans>Sign In</Trans>
            </ThemedText>
            <Icon name="chevron.right" color={Colors.neutral50} />
          </ThemedView>
        </Pressable>
      </ThemedView>
    </>
  );
}
