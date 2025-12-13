import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren, useContext, useEffect, useState } from "react";

import { apiBaseUrl } from "@/constants";
import { AuthContext } from "@/context";
import { User } from "@/utils";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const login = async () => {
    try {
      // Step 1: Get auth URL from your backend (with target=mobile)
      const urlRes = await fetch(
        `${apiBaseUrl}/auth/workos/login?target=mobile`,
      );
      const { authUrl } = await urlRes.json();

      // Step 2: Open system browser with WorkOS auth
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        "voieech://auth/callback",
      );

      if (result.type !== "success" || !result.url) {
        console.log("Login cancelled");
        return;
      }

      // Step 3: Extract tokens and user data from callback (already exchanged by backend)
      const { queryParams } = Linking.parse(result.url);
      const accessToken = queryParams?.accessToken as string;
      const refreshToken = queryParams?.refreshToken as string;
      const userData = queryParams?.user as string;

      if (!accessToken || !refreshToken) {
        console.error("No tokens received");
        return;
      }

      if (!userData) {
        console.error("Missing user data");
        return;
      }

      // Step 4: Store tokens
      await SecureStore.setItemAsync("access_token", accessToken);
      await SecureStore.setItemAsync("refresh_token", refreshToken);
      await SecureStore.setItemAsync("user_data", userData);

      setUser(JSON.parse(userData));
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const refreshSession = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refresh_token");
      if (!refreshToken) {
        setUser(undefined);
        return;
      }

      const res = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        await SecureStore.getItemAsync("access_token");
        await SecureStore.getItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("user_data");
        setUser(undefined);
        return;
      }

      const data = await res.json();
      await SecureStore.setItemAsync("access_token", data.accessToken);
      await SecureStore.setItemAsync("refresh_token", data.refreshToken);
      await SecureStore.setItemAsync("user_data", JSON.stringify(data.user));
      setUser(data.user);
      return;
    } catch (err) {
      console.error("Refresh error: ", err);
      // Don't clear user state on network errors - keep cached state
      return;
    }
  };

  const logout = async () => {
    // Clear all stored auth data
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("user_data");
    setUser(undefined);
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        // Check if user has logged in before
        const storedUser = await SecureStore.getItemAsync("user_data");
        const refreshToken = await SecureStore.getItemAsync("refresh_token");

        if (storedUser && refreshToken) {
          // User has logged in before - restore their session immediately
          setUser(JSON.parse(storedUser));

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
      value={{ user, login, logout, refreshSession, isLoading }}
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
