import { createContext } from "react";

import type { AuthDataFromWorkos } from "@/types";

import { createUseContextHook } from "@/utils";

export const AuthContext = createContext<{
  /**
   * Is authentication progress running in the background?
   *
   * This is needed since we do the initial auth check in background, so we
   * might want to hide the profile screen details until it is done.
   */
  isLoading: boolean;

  /**
   * Is the current user authenticated?
   */
  isAuthenticated: boolean;

  /**
   * The auth data from WorkOS
   */
  authData: AuthDataFromWorkos | null;

  /**
   * Trigger login process
   */
  login: (options?: {
    /**
     * Callback called when user successfully login
     */
    onLoginSuccess?: () => unknown;
  }) => Promise<void>;

  /**
   * Trigger logout process
   */
  logout: () => Promise<void>;

  /**
   * Show a global / root level, full screen sign in modal.
   */
  showFullScreenSigninModal: boolean;

  /**
   * Show a global / root level, full screen sign in modal if the user is not
   * authenticated.
   */
  showFullScreenSigninModalIfNotAuthenticated: () => void;

  /**
   * Clear the global / root level, full screen sign in modal.
   */
  clearFullScreenSigninModal: () => void;
}>(
  // @ts-expect-error
  null,
);

export const useAuthContext = createUseContextHook(AuthContext, "AuthContext");
