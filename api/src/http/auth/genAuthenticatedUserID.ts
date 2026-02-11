import type { Request } from "express";

import { authenticationAssertionCheck } from "./authenticationAssertionCheck.js";
import { genAuthenticatedUser } from "./genAuthenticatedUser.js";

/**
 * Get User ID from the token if it is available on the token (it can be
 * undefined if the external_id field has not been set onto workos yet.), else
 * it will load the authenticated user from DB and get the ID from there.
 */
export async function genAuthenticatedUserID(this: Request) {
  authenticationAssertionCheck(this);
  return (
    this.__userAuthenticationData.jwtPayload.external_id ??
    (await genAuthenticatedUser.call(this)).id
  );
}
