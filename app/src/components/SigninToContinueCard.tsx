import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Pressable } from "react-native";

import { Colors } from "@/constants";
import { useAuthContext } from "@/context";

import { Icon } from "./provided";
import { ThemedView, ThemedText } from "./ThemedComponents";

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

  return (
    <ThemedView
      style={{
        rowGap: 24,
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
          <Trans>Get access to exclusive member only features right now!</Trans>
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
  );
}
