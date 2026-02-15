import type { PropsWithChildren } from "react";

import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";

import type { AuthDataFromWorkos } from "@/types";

import { postDeleteDevicePushNotificationTokens } from "@/api";
import { reactQueryClient } from "@/api-client";
import { authController, secureStoreForAuth } from "@/auth";
import { AuthContext } from "@/context";
import { envVar, getPushNotificationTokens } from "@/utils";

// Warm up browser for faster auth
WebBrowser.maybeCompleteAuthSession();

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthData] = useState<AuthDataFromWorkos | null>(null);
  const [showFullScreenSigninModal, setShowFullScreenSigninModal] =
    useState(false);
  const isAuthenticated = authData?.userData !== undefined;

  async function clearAuth() {
    await secureStoreForAuth.deleteAllData();
    setAuthData(null);
  }

  const login = useCallback(async function (options?: {
    onLoginSuccess?: () => unknown;
  }) {
    await authController.login();
    const authData = await secureStoreForAuth.getAllAuthDataNonNull();
    setAuthData(authData);
    reactQueryClient.clear();
    await options?.onLoginSuccess?.();
  }, []);

  async function logout() {
    try {
      // Delete the push notif tokens first while the auth token is still not
      // cleared since the API needs this.
      await getPushNotificationTokens().then(
        postDeleteDevicePushNotificationTokens,
      );

      const accessToken = await secureStoreForAuth.getAccessTokenString();

      if (accessToken !== null) {
        await fetch(`${envVar.apiBaseUrlForAuth}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }).catch((err) => console.error("Logout API call failed:", err));
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }

    await clearAuth();
    reactQueryClient.clear();
  }

  async function showFullScreenSigninModalIfNotAuthenticated() {
    if (!isAuthenticated) {
      setShowFullScreenSigninModal(true);
    }
  }

  async function clearFullScreenSigninModal() {
    setShowFullScreenSigninModal(false);
  }

  // On initial run, restore user's session if user was logged in the last time
  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);

      const authData = await secureStoreForAuth.getAllAuthData();

      // If no auth token stored, assume user hasn't logged in and let them
      // continue using the app as guest
      if (authData.accessToken === null) {
        setIsLoading(false);
        return;
      }

      // If user has logged in before, immediately and optimistically restore
      // their session using stored auth data, before refreshing session /
      // checking session validity in background.
      // This also has the added benefit of allowing the user to use the app in
      // a logged in state when offline.
      setAuthData(await secureStoreForAuth.getAllAuthDataNonNull());

      // Fire and forget to refresh session in background to:
      // 1. Validate session is still valid
      // 2. Get fresh user data
      // 3. Get new access token if needed
      authController.refreshSession({
        onSuccess(authData) {
          setAuthData(authData);
        },

        // If failed to refresh, clear user and auth data
        async onFailure(err) {
          console.error("Initial background refresh failed:", err);
          await clearAuth();
        },
      });

      setIsLoading(false);
    }

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        authData,
        login,
        logout,
        showFullScreenSigninModal,
        showFullScreenSigninModalIfNotAuthenticated,
        clearFullScreenSigninModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
