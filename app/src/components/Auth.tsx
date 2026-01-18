import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "@/types";

import { apiBaseUrl } from "@/constants";
import { AuthContext } from "@/context";
import {
  generatePkceCode,
  secureStoreForAuth,
  decodeJwtToken,
  isJwtExpiredOrExpiringSoon,
} from "@/utils";

// Warm up browser for faster auth
WebBrowser.maybeCompleteAuthSession();

// @todo Rename the files
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  async function login() {
    try {
      // Step 1: Get auth URL from your backend (with target=mobile)
      const pkceCode = await generatePkceCode();

      const params = new URLSearchParams({
        target: "mobile",
        codeChallenge: pkceCode.codeChallenge,
        challengeMethod: pkceCode.codeChallengeMethod,
      });

      const urlRes = await fetch(
        `${apiBaseUrl}/auth/workos/login?${params.toString()}`,
      );

      if (!urlRes.ok) {
        throw new Error(`Failed to get auth URL: ${urlRes.status}`);
      }

      const { authUrl } = await urlRes.json();

      if (!authUrl) {
        throw new Error("No auth URL received");
      }

      // Step 2: Open system browser with WorkOS auth
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        "voieech://auth/callback",
      );

      if (result.type === "cancel") {
        console.log("Login cancelled by user");
        return;
      }

      if (result.type !== "success" || !result.url) {
        throw new Error("Authentication failed");
      }

      // Step 3: Extract auth code callback
      const queryParams = Linking.parse(result.url)?.queryParams;

      if (queryParams == null) {
        throw new Error("Missing query params from auth callback");
      }

      if (queryParams.error !== undefined) {
        throw new Error(queryParams.error as string);
      }

      const authorizationCode = queryParams.authorizationCode?.toString?.();
      if (authorizationCode === undefined) {
        throw new Error("No one time code received from auth callback");
      }

      // Step 4: Exchange auth code and code verifier for tokens
      const exchangeRes = await fetch(
        `${apiBaseUrl}/auth/workos/exchange-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorizationCode,
            pkceCodeVerifier: pkceCode.codeVerifier,
          }),
        },
      );

      if (!exchangeRes.ok) {
        const errorData = await exchangeRes.json();
        throw new Error(errorData?.error || "Failed to exchange code");
      }

      const {
        accessToken,
        refreshToken,
        user: userData,
      } = await exchangeRes.json();

      if (
        accessToken === undefined ||
        refreshToken === undefined ||
        userData === undefined
      ) {
        throw new Error("Incomplete authentication data from exchange");
      }

      await secureStoreForAuth.saveAllAuthData({
        accessToken,
        refreshToken,
        userData,
      });

      setUser(userData);
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  const clearAuth = useCallback(async function () {
    await secureStoreForAuth.deleteAllData();
    setUser(undefined);
  }, []);

  const refreshSession = useCallback(
    async function () {
      try {
        const refreshToken = await secureStoreForAuth.getRefreshToken();

        // @todo why?
        if (refreshToken === null) {
          await clearAuth();
          return;
        }

        const res = await fetch(`${apiBaseUrl}/auth/workos/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
          await clearAuth();
          return;
        }

        const data = await res.json();

        await secureStoreForAuth.saveAllAuthData({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userData: data.user,
        });

        setUser(data.user);
        return data.user;
      } catch (err) {
        console.error("Refresh error:", err);
        throw err;
      }
    },
    [clearAuth],
  );

  /**
   * Returns the authorization header needed for API calls with a fresh (will
   * refresh if stale) access token string.
   */
  const getAuthHeader = useCallback(
    async function () {
      let accessTokenString = await secureStoreForAuth.getAccessTokenString();

      // @todo Handle this better
      if (accessTokenString === null) {
        throw new Error("No auth token available for auth header");
      }

      // @todo Should maintain a cached object instead of constantly decoding it from string
      const accessToken = decodeJwtToken(accessTokenString);

      if (isJwtExpiredOrExpiringSoon(accessToken.exp)) {
        await refreshSession();
        accessTokenString = await secureStoreForAuth.getAccessTokenString();
      }

      return {
        Authorization: `Bearer ${accessTokenString}`,
      };
    },
    [refreshSession],
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
    } finally {
      await clearAuth();
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        // Check if user has logged in before
        const authData = await secureStoreForAuth.getAllAuthData();
        if (authData.userData !== null && authData.refreshToken !== null) {
          // User has logged in before - restore their session immediately
          try {
            setUser(authData.userData);
          } catch (parseErr) {
            console.error("Failed to parse stored user data:", parseErr);
            await clearAuth();
            return;
          }

          // Refresh token in background to:
          // 1. Validate session is still valid
          // 2. Get fresh user data
          // 3. Get new access token if needed
          // Don't await - let app load instantly
          refreshSession().catch((err) => {
            console.error("Background refresh failed:", err);
            // User keeps cached state even if refresh fails
          });
        }

        // If no stored data, user hasn't logged in - do nothing
        // Let them continue using the app as guest
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshSession, clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshSession,
        getAccessToken: secureStoreForAuth.getAccessTokenString,
        getAuthHeader,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error(`${useAuth.name} must be used within AuthProvider`);
  }
  return ctx;
}
