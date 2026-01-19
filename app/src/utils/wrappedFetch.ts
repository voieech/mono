import { authController } from "@/controller";

import { isJwtExpiredOrExpiringSoon } from "./isJwtExpiredOrExpiringSoon";
import { secureStoreForAuth } from "./secureStoreForAuth";

let promiseForAccessTokenAfterRefresh: Promise<string> | null = null;

/**
 * Returns the authorization header needed for API calls with a fresh (will
 * refresh if stale) access token string.
 */
async function getValidToken(): Promise<string | null> {
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
        // @todo Pass in an error token
        reject();
      },
    });
  });

  return promiseForAccessTokenAfterRefresh;
}

export async function wrappedFetch(...args: Parameters<typeof fetch>) {
  let [input, init] = args;

  if (init === undefined) {
    init = {};
  }

  const originalHeaders = init.headers;

  init.headers = {
    ...originalHeaders,
    Authorization: `Bearer ${await getValidToken()}`,
  };

  // @todo
  console.log("final header for", input, init.headers);

  return fetch(input, init);
}
