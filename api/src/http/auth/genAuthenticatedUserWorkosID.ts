import type { Request } from "express";

import { authenticationAssertionCheck } from "./authenticationAssertionCheck.js";

/**
 * Get the user's WorkOS User ID from the request's decoded JWT payload
 */
export async function genAuthenticatedUserWorkosID(this: Request) {
  authenticationAssertionCheck(this);
  return this.__userAuthenticationData.jwtPayload.sub;
}
