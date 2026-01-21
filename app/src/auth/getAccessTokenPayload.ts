import type { JWTPayload } from "@/types";

import { decodeJwtToken } from "./decodeJwtToken";

let cachedAccessToken: string | null = null;
let cachedAccessTokenPayload: JWTPayload | null = null;

export function getAccessTokenPayload(accessToken: string) {
  if (accessToken === cachedAccessToken && cachedAccessTokenPayload !== null) {
    return cachedAccessTokenPayload;
  }

  cachedAccessToken = accessToken;
  cachedAccessTokenPayload = decodeJwtToken(accessToken);

  return cachedAccessTokenPayload;
}
