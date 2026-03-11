import type { Request } from "express";

import type { RequestUserAuthenticationDataForAuthenticatedUser } from "./RequestUserAuthenticationDataForAuthenticatedUser.js";

import {
  InvalidInternalStateException,
  UnauthorizedException,
  ForbiddenException,
} from "../../exceptions/index.js";

/**
 * A narrowing of the global `req.__userAuthenticationData` field to only hold
 * authenticated user data, to make it easier to use downstream after
 * authentication assertion check.
 */
type RequestWithRequestUserAuthenticationDataForAuthenticatedUser = Request & {
  __userAuthenticationData: RequestUserAuthenticationDataForAuthenticatedUser;
};

/**
 * An assertion to check if a user is indeed authenticated. If the user is not
 * authenticated, this will throw a `HttpTransformerableException` using the
 * authentication result set in `authenticationSetupMiddleware`.
 *
 * Once assertion is completed, this will assert that the `req` input argument
 * stores authenticated user data, making it easy to access and use without any
 * additional guards.
 *
 * This is "memoized" per request/response cycle, so duplicate calls to this is
 * fine/fast.
 */
export function authenticationAssertionCheck(
  req: Request,
): asserts req is RequestWithRequestUserAuthenticationDataForAuthenticatedUser {
  // Check if flag is set to skip checks, if all checks have ran and passed
  // during previous calls to this function in the same request/response cycle.
  if (req.__authenticationAssertionCheckPassed) {
    return;
  }

  if (req.__userAuthenticationData === undefined) {
    throw new InvalidInternalStateException(
      "Internal Error: Missing user authentication data because authenticationMiddleware did not run",
    );
  }

  if (!req.__userAuthenticationData.isAuthenticated) {
    switch (req.__userAuthenticationData.httpStatusCode) {
      case 401:
        throw new UnauthorizedException(req.__userAuthenticationData.reason);
      case 403:
        throw new ForbiddenException(req.__userAuthenticationData.reason);
      default:
        throw new InvalidInternalStateException(
          `Internal Error: Invalid HTTP status code found '${req.__userAuthenticationData.httpStatusCode}'`,
        );
    }
  }

  // Set flag once all check is passed to skip all subsequent calls to this
  // function in this same request/response cycle.
  req.__authenticationAssertionCheckPassed = true;
}
