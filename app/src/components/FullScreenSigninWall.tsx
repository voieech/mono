import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Pressable, useWindowDimensions } from "react-native";

import { Icon } from "@/components/provided";
import { ThemedView, ThemedText } from "@/components/ThemedComponents";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";

/**
 * A full screen wall that blocks out all content behind it, if the user is not
 * authenticated. Will show link for user to authenticate to continue. This will
 * do nothing if user is already authenticated.
 */
export function FullScreenSigninWall() {
  const authContext = useAuthContext();
  const windowDimensions = useWindowDimensions();
  const contentBoxWidth = windowDimensions.width * 0.8;

  // Show nothing if authenticated
  if (authContext.isAuthenticated) {
    return null;
  }

  return (
    <ThemedView
      style={{
        // 1. Cover the entire screen
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,

        // 2. Center the children vertically and horizontally
        justifyContent: "center",
        alignItems: "center",

        // 3. Background styling, with a white "frosted" look
        backgroundColor: "rgba(255, 255, 255, 0.4)",
      }}
    >
      <ThemedView
        style={{
          padding: 24,
          borderRadius: 16,
          width: contentBoxWidth,
          flexDirection: "column",
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
          <ThemedText type="base-light">
            <Trans>
              Get access to exclusive member only features right now!
            </Trans>
          </ThemedText>
        </ThemedView>
        <Pressable onPress={authContext.login}>
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
            <ThemedText type="lg-thin">
              <Trans>Sign In</Trans>
            </ThemedText>
            <Icon name="chevron.right" color={Colors.neutral50} />
          </ThemedView>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}
