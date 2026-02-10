import type { DatabaseUser } from "../../kysely/index.js";
import type { JwtPayload } from "./jwtPayloadSchema.js";

/**
 * Type of the data stored on the `req` object by `authenticationMiddleware`
 * after checking for request user's authentication status, and finding the user
 * to be authenticated.
 */
export type RequestUserAuthenticationDataForAuthenticatedUser = {
  /**
   * Flag to determine if the user is authenticated. This will be set to
   * true if user is authenticated after the request passes through the
   * `authenticationMiddleware` successfully.
   */
  isAuthenticated: true;

  /**
   * The decoded and verified JWT payload.
   */
  jwtPayload: JwtPayload;

  /**
   * This is only for internal API use, as a request scoped caching mechanism.
   *
   * This is the user data from DB, which can be used for authorization checks
   * by subsequent API handlers.
   */
  user?: DatabaseUser | undefined;
};
