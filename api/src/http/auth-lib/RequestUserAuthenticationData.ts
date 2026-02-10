import type { RequestUserAuthenticationDataForAuthenticatedUser } from "./RequestUserAuthenticationDataForAuthenticatedUser.js";
import type { RequestUserAuthenticationDataForUnauthenticatedUser } from "./RequestUserAuthenticationDataForUnauthenticatedUser.js";

/**
 * Type of the data stored on the `req` object by `authenticationMiddleware`
 * after checking for request user's authentication status.
 *
 * It can be undefined before it is set by `authenticationMiddleware`.
 */
export type RequestUserAuthenticationData =
  | undefined
  | RequestUserAuthenticationDataForAuthenticatedUser
  | RequestUserAuthenticationDataForUnauthenticatedUser;
