import type { Request } from "express";

import { InvalidInternalStateException } from "../../exceptions/index.js";
import { apiDB } from "../../kysely/apiDB.js";
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
    const userFromDB = await apiDB
      .selectFrom("user")
      .selectAll()
      .where("workos_id", "=", this.__userAuthenticationData.jwtPayload.sub)
      .executeTakeFirst();

    if (userFromDB === undefined) {
      throw new InvalidInternalStateException(
        "Internal Error: User is authenticated but does not exist in DB",
      );
    }

    this.__userAuthenticationData.user = userFromDB;
  }

  return this.__userAuthenticationData.user;
}
