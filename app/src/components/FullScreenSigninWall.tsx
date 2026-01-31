import { ThemedView } from "@/components/ThemedComponents";
import { useAuthContext } from "@/context";

import { SigninToContinueCard } from "./SigninToContinueCard";

/**
 * A full screen signin to continue wall that blocks out all content behind it
 * if the user is not signed in. This will do nothing if user is already
 * signed in.
 *
 * This does not allow user to "press away", if you want that capability, use
 * the `FullScreenSigninModal` flow instead. See `authContext`'s method.
 */
export function FullScreenSigninWall() {
  const authContext = useAuthContext();

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
      <SigninToContinueCard />
    </ThemedView>
  );
}
