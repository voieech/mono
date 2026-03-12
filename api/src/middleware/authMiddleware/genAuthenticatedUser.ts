import type { Request } from "express";

import { userRepo } from "../../dal/index.js";
import { InvalidInternalStateException } from "../../exceptions/index.js";
import { authenticationAssertionCheck } from "./authenticationAssertionCheck.js";

/**
 * Loads the authenticated user from DB. Will throw if the user is not
 * authenticated or if user does not exist in DB, but you do not need to catch
 * this since the error handler will handle this.
 *
 * This can be called multiple times as the result is cached for each
 * request/response cycle.
 *
 * @todo
 * Invalidate the cached user object if the user is updated in the same cycle.
 */
export async function genAuthenticatedUser(this: Request) {
  authenticationAssertionCheck(this);

  if (this.__userAuthenticationData.user === undefined) {
    const userWorkosID = this.__userAuthenticationData.jwtPayload.sub;
    const user = await userRepo.getUserByWorkosId(userWorkosID);
    if (user === undefined) {
      throw new InvalidInternalStateException(
        "Internal Error: User is authenticated but does not exist in DB",
      );
    }
    this.__userAuthenticationData.user = user;
  }

  return this.__userAuthenticationData.user;
}
