import { Modal, Pressable } from "react-native";

import { useAuthContext } from "@/context";

import { SigninToContinueCard } from "./SigninToContinueCard";

/**
 * A full screen modal that can be shown when user is not signed in. This can be
 * controlled from anywhere in the app using the `authContext`. If you want to
 * block a screen from being used at all when user is not signed in, use the
 * `FullScreenSigninWall` component instead.
 */
export function FullScreenSigninModal() {
  const authContext = useAuthContext();
  return (
    <Modal
      transparent={true}
      visible={authContext.showFullScreenSigninModal}
      animationType={authContext.showFullScreenSigninModal ? "slide" : "fade"}
    >
      <Pressable
        onPress={authContext.clearFullScreenSigninModal}
        style={{
          // 1. Cover the entire screen
          flex: 1,

          // 2. Center the children vertically and horizontally
          justifyContent: "center",
          alignItems: "center",

          // 3. Background styling, with a white "frosted" look
          backgroundColor: "rgba(255, 255, 255, 0.4)",
        }}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <SigninToContinueCard
            onCancel={authContext.clearFullScreenSigninModal}
            onLoginSuccess={authContext.clearFullScreenSigninModal}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
