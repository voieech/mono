import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren, useContext, useEffect, useState } from "react";

import { apiBaseUrl } from "@/constants";
import { AuthContext } from "@/context";
import { User } from "@/utils";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(undefined);

  // Fetch user using JWT
  const refreshSession = async () => {
    const token = await SecureStore.getItemAsync("auth_token");
    if (!token) {
      setUser(undefined);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(undefined);
      }
    } catch (err) {
      console.error("Error fetching session:", err);
      setUser(undefined);
    }
  };

  const login = async () => {
    try {
      const loginUrl = `${apiBaseUrl}/auth/workos/login?target=mobile`;
      const redirectUri = "voieech://auth/callback";

      const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        redirectUri,
      );

      if (result.type !== "success" || !result.url) {
        console.log("Login cancelled");
        return;
      }

      // Extract JWT from deep link
      const { queryParams } = Linking.parse(result.url);
      const token = queryParams?.token as string | undefined;

      if (!token) {
        console.error("No token in redirect");
        return;
      }

      await SecureStore.setItemAsync("auth_token", token);
      await refreshSession();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("auth_token");
    setUser(undefined);
    await fetch(`${apiBaseUrl}/auth/workos/logout`);
  };

  // Bootstrap auth on app start
  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
