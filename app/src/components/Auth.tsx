import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren, useContext, useEffect, useState } from "react";

import { apiBaseUrl } from "@/constants";
import { AuthContext } from "@/context";
import { User } from "@/utils";

// Warm up browser for faster auth
WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const;

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  async function login() {
    try {
      // Step 1: Get auth URL from your backend (with target=mobile)
      const urlRes = await fetch(
        `${apiBaseUrl}/auth/workos/login?target=mobile`,
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

      // Step 3: Extract tokens and user data from callback (already exchanged by backend)
      const { queryParams } = Linking.parse(result.url);

      if (queryParams?.error) {
        throw new Error(queryParams.error as string);
      }

      const oneTimeCode = queryParams?.code as string;

      if (!oneTimeCode) {
        throw new Error("No code received from authentication");
      }

      // Step 4: Exchange one-time code for tokens
      const exchangeRes = await fetch(`${apiBaseUrl}/auth/exchange-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: oneTimeCode }),
      });

      if (!exchangeRes.ok) {
        const errorData = await exchangeRes.json();
        throw new Error(errorData.error || "Failed to exchange code");
      }

      const {
        accessToken,
        refreshToken,
        user: userData,
      } = await exchangeRes.json();

      if (!accessToken || !refreshToken || !userData) {
        throw new Error("Incomplete authentication data");
      }

      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        SecureStore.setItemAsync(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(userData),
        ),
      ]);

      setUser(userData);
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  async function refreshSession() {
    try {
      const refreshToken = await SecureStore.getItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN,
      );

      if (!refreshToken) {
        await clearAuth();
        return;
      }

      const res = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        await clearAuth();
        return;
      }

      const data = await res.json();

      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken),
        SecureStore.setItemAsync(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(data.user),
        ),
      ]);

      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Refresh error:", err);
      throw err;
    }
  }

  async function clearAuth() {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA),
    ]);
    setUser(undefined);
  }

  async function logout() {
    try {
      const accessToken = await SecureStore.getItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN,
      );

      if (accessToken) {
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

  async function getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  }

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        // Check if user has logged in before
        const [storedUser, refreshToken] = await Promise.all([
          SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA),
          SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        ]);

        if (storedUser && refreshToken) {
          // User has logged in before - restore their session immediately
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
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
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshSession, getAccessToken, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
