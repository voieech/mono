import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import type { AuthDataFromWorkos } from "@/types";

import { apiBaseUrl } from "@/constants";

import { generatePkceCode } from "./generatePkceCode";
import { secureStoreForAuth } from "./secureStoreForAuth";

export const authController = {
  async login() {
    try {
      // Step 1: Get auth URL from your backend
      const pkceCode = await generatePkceCode();

      const params = new URLSearchParams({
        clientType: "mobile",
        pkceCodeChallenge: pkceCode.codeChallenge,
        pkceCodeChallengeMethod: pkceCode.codeChallengeMethod,
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
        console.error("Login cancelled by user");
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
    } catch (err) {
      // Log and bubble error up
      console.error("Login error:", err);
      throw err;
    }
  },

  async refreshSession(callbacks?: {
    onSuccess?: (authData: AuthDataFromWorkos) => unknown;
    onFailure?: () => unknown;
  }) {
    try {
      const refreshToken = await secureStoreForAuth.getRefreshToken();

      if (refreshToken === null) {
        await secureStoreForAuth.deleteAllData();
        await callbacks?.onFailure?.();
        return;
      }

      const res = await fetch(`${apiBaseUrl}/auth/workos/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        await secureStoreForAuth.deleteAllData();
        await callbacks?.onFailure?.();
        return;
      }

      // @todo Validate data instead of type casting it
      const data: AuthDataFromWorkos = await res.json();

      await secureStoreForAuth.saveAllAuthData(data);

      await callbacks?.onSuccess?.(data);
    } catch (err) {
      // Log and bubble error up
      console.error("Refresh error:", err);
      throw err;
    }
  },
};
