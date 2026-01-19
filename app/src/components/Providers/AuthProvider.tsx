import type { PropsWithChildren } from "react";

import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";

import type { AuthDataFromWorkos } from "@/types";

import { apiBaseUrl } from "@/constants";
import { AuthContext } from "@/context";
import { authController } from "@/controller";
import { secureStoreForAuth } from "@/utils";

// Warm up browser for faster auth
WebBrowser.maybeCompleteAuthSession();

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthData] = useState<AuthDataFromWorkos | null>(null);

  async function clearAuth() {
    await secureStoreForAuth.deleteAllData();
    setAuthData(null);
  }

  const login = useCallback(async function () {
    await authController.login();
    const authData = await secureStoreForAuth.getAllAuthDataNonNull();
    setAuthData(authData);
  }, []);

  const refreshSession = useCallback(
    () =>
      authController.refreshSession({
        onSuccess(authData) {
          setAuthData(authData);
        },
        async onFailure() {
          await clearAuth();
        },
      }),

    // @todo Remove this deps arr since it will never change
    [setAuthData],
  );

  async function logout() {
    try {
      const accessToken = await secureStoreForAuth.getAccessTokenString();

      if (accessToken !== null) {
        // Fire and forget - don't wait for response
        fetch(`${apiBaseUrl}/auth/logout`, {
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
      refreshSession()
        // If failed to refresh, clear user and auth data
        .catch((err) => {
          console.error("Initial background refresh failed:", err);
          clearAuth();
        });

      setIsLoading(false);
    }

    initAuth();
  }, [refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: authData?.userData !== null,
        authData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
