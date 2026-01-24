import { convertUnknownCatchToError } from "convert-unknown-catch-to-error";
import * as jose from "jose";

import { workos, WORKOS_CLIENT_ID } from "./workos.js";

const jwksUrl = workos.userManagement.getJwksUrl(WORKOS_CLIENT_ID);
const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl));
const workosIssuerUrl = `https://api.workos.com/user_management/${WORKOS_CLIENT_ID}`;

/**
 * Decode the JWT access token string, and verify the JWT by checking the
 * signature and claims against the public key available in workos.
 */
export async function decodeAndVerifyJwtAccessTokenString(
  token: string,
): Promise<$ResultTuple<jose.JWTPayload>> {
  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: workosIssuerUrl,
      // Since workos does not return "aud" field by default, not passing in any
      // "audience" field for verification else it will fail
      // audience: WORKOS_CLIENT_ID,
    });
    return [null, payload];
  } catch (e) {
    const error = convertUnknownCatchToError(e);
    return [
      new Error(`Unauthorized: Invalid or expired token - ${error?.message}`),
      null,
    ];
  }
}
