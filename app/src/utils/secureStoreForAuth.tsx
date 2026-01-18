import * as SecureStore from "expo-secure-store";

/**
 * Storage keys are name spaced under "auth" to prevent naming conflicts
 */
const AUTH_DATA_STORAGE_KEYS = {
  ACCESS_TOKEN: "auth.access_token",
  REFRESH_TOKEN: "auth.refresh_token",
  USER_DATA: "auth.user_data",
} as const;

// @todo Add concrete type
type UserData = object;

/**
 * Auth data from workos auth
 */
type AuthData = {
  accessToken: string;
  refreshToken: string;
  userData: UserData;
};

export const secureStoreForAuth = {
  getAccessToken() {
    return SecureStore.getItemAsync(AUTH_DATA_STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken() {
    return SecureStore.getItemAsync(AUTH_DATA_STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get all auth data from secure store
   */
  async getAllAuthData() {
    const [accessToken, refreshToken, userData] = await Promise.all([
      SecureStore.getItemAsync(AUTH_DATA_STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.getItemAsync(AUTH_DATA_STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.getItemAsync(AUTH_DATA_STORAGE_KEYS.USER_DATA),
    ]);
    return {
      accessToken,
      refreshToken,
      userData: userData === null ? null : JSON.parse(userData),
    } satisfies Record<keyof AuthData, unknown>;
  },

  /**
   * Save all auth data to secure store
   */
  async saveAllAuthData(authData: AuthData) {
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
