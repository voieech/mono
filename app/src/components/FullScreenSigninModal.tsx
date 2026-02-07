import { useAuthContext } from "@/context";

import { CommonModal } from "./CommonModal";
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
    <CommonModal
      modalVisible={authContext.showFullScreenSigninModal}
      onClose={authContext.clearFullScreenSigninModal}
      closeModalMessage="Cancel"
    >
      <SigninToContinueCard
        onCancel={authContext.clearFullScreenSigninModal}
        onLoginSuccess={authContext.clearFullScreenSigninModal}
      />
    </CommonModal>
  );
}
