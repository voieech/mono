import * as SecureStore from "expo-secure-store";

import type { User, AuthData, AuthDataFromWorkos } from "@/types";

import { getAccessTokenPayload } from "./getAccessTokenPayload";

/**
 * Storage keys are name spaced under "auth" to prevent naming conflicts
 */
const AUTH_DATA_STORAGE_KEYS = {
  ACCESS_TOKEN: "auth.access_token",
  REFRESH_TOKEN: "auth.refresh_token",
  USER_DATA: "auth.user_data",
} as const;

export const secureStoreForAuth = {
  /**
   * Get the Access token string if available. This is an encoded JWT string.
   */
  getAccessTokenString() {
    return SecureStore.getItemAsync(AUTH_DATA_STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get the Refresh token string if available. This is an opaque string.
   */
  getRefreshToken() {
    return SecureStore.getItemAsync(AUTH_DATA_STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get the auth user data from secure store
   */
  async getAuthUserData() {
    const userData = await SecureStore.getItemAsync(
      AUTH_DATA_STORAGE_KEYS.USER_DATA,
    );
    return userData === null ? null : (JSON.parse(userData) as User);
  },

  /**
   * Get all auth data from secure store
   */
  async getAllAuthData() {
    const [accessToken, refreshToken, userData] = await Promise.all([
      this.getAccessTokenString(),
      this.getRefreshToken(),
      this.getAuthUserData(),
    ]);
    const accessTokenPayload =
      accessToken === null ? null : getAccessTokenPayload(accessToken);

    return {
      accessToken,
      accessTokenPayload,
      refreshToken,
      userData,
    } satisfies Record<keyof AuthData, unknown>;
  },

  /**
   * Get all auth data from secure store, ensuring all the values are valid
   */
  async getAllAuthDataNonNull() {
    const { accessToken, accessTokenPayload, refreshToken, userData } =
      await this.getAllAuthData();

    // @todo use zod validator
    const err = new Error("Missing auth data from secure store");
    if (accessToken === null) {
      throw err;
    }
    if (accessTokenPayload === null) {
      throw err;
    }
    if (refreshToken === null) {
      throw err;
    }
    if (userData === null) {
      throw err;
    }

    return {
      accessToken,
      accessTokenPayload,
      refreshToken,
      userData,
    };
  },

  /**
   * Save all auth data to secure store
   */
  async saveAllAuthData(authData: AuthDataFromWorkos) {
    await Promise.all([
      SecureStore.setItemAsync(
        AUTH_DATA_STORAGE_KEYS.ACCESS_TOKEN,
        authData.accessToken,
      ),
      SecureStore.setItemAsync(
        AUTH_DATA_STORAGE_KEYS.REFRESH_TOKEN,
        authData.refreshToken,
      ),
      SecureStore.setItemAsync(
        AUTH_DATA_STORAGE_KEYS.USER_DATA,
        JSON.stringify(authData.userData),
      ),
    ]);
  },

  /**
   * Delete all auth data in secure store
   */
  async deleteAllData() {
    await Promise.all([
      SecureStore.deleteItemAsync(AUTH_DATA_STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(AUTH_DATA_STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(AUTH_DATA_STORAGE_KEYS.USER_DATA),
    ]);
  },
};
