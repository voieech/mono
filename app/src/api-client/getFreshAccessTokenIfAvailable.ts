import { authController, secureStoreForAuth } from "@/auth";

import { isJwtExpiredOrExpiringSoon } from "./isJwtExpiredOrExpiringSoon";

let promiseForAccessTokenAfterRefresh: Promise<string> | null = null;

/**
 * Returns the access token string needed for API calls if available, and will
 * refresh if it is stale.
 */
export async function getFreshAccessTokenIfAvailable(): Promise<string | null> {
  // TO AVOID RACE CONDITIONS: If a refresh is already in progress, wait for it
  if (promiseForAccessTokenAfterRefresh !== null) {
    return promiseForAccessTokenAfterRefresh;
  }

  const authData = await secureStoreForAuth.getAllAuthData();

  if (authData.accessToken === undefined) {
    return null;
  }

  if (authData.accessTokenPayload?.exp === undefined) {
    return null;
  }

  if (!isJwtExpiredOrExpiringSoon(authData.accessTokenPayload.exp)) {
    return authData.accessToken;
  }

  // Start new refresh and save this promise to prevent duplicate calls
  promiseForAccessTokenAfterRefresh = new Promise((resolve, reject) => {
    authController.refreshSession({
      async onSuccess(authData) {
        await secureStoreForAuth.saveAllAuthData(authData);
        promiseForAccessTokenAfterRefresh = null;
        resolve(authData.accessToken);
      },
      onFailure() {
        promiseForAccessTokenAfterRefresh = null;
        reject(
          new Error(
            `${getFreshAccessTokenIfAvailable.name}: Failed to refresh token`,
          ),
        );
      },
    });
  });

  return promiseForAccessTokenAfterRefresh;
}
