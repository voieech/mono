import type { Request } from "express";

import { authenticationAssertionCheck } from "./authenticationAssertionCheck.js";

/**
 * Get the request's decoded JWT payload
 */
export async function genAuthenticatedUserJwtPayload(this: Request) {
  authenticationAssertionCheck(this);
  return this.__userAuthenticationData.jwtPayload;
}
