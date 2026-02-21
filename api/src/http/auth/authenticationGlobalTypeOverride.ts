import type { genAuthenticatedUser } from "./genAuthenticatedUser.js";
import type { genAuthenticatedUserID } from "./genAuthenticatedUserID.js";
import type { genAuthenticatedUserJwtPayload } from "./genAuthenticatedUserJwtPayload.js";
import type { genAuthenticatedUserWorkosID } from "./genAuthenticatedUserWorkosID.js";
import type { RequestUserAuthenticationData } from "./RequestUserAuthenticationData.js";

declare global {
  namespace Express {
    interface Request {
      /**
       * Loads the authenticated user from DB. Will throw if the user is not
       * authenticated or if user does not exist in DB, but you do not need to
       * catch this since the error handler will handle this.
       *
       * See code definition for more details.
       */
      genAuthenticatedUser: typeof genAuthenticatedUser;

      /**
       * Get User ID from the token if it is available on the token (it can be
       * undefined if the external_id field has not been set onto workos yet.),
       * else it will load the authenticated user from DB and get the ID from
       * there.
       */
      genAuthenticatedUserID: typeof genAuthenticatedUserID;

      /**
       * Get the request's decoded JWT payload
       */
      genAuthenticatedUserJwtPayload: typeof genAuthenticatedUserJwtPayload;

      /**
       * Get the user's WorkOS User ID from the request's decoded JWT payload
       */
      genAuthenticatedUserWorkosID: typeof genAuthenticatedUserWorkosID;

      /**
       * Flag set by `authenticationMiddleware` as a quick and easy way for
       * downstream middlewares and route handlers to know whether the current
       * is authenticated.
       */
      isUserAuthenticated: boolean;

      /**
       * ## DO NOT USE
       * Internal framework data for authentication.
       */
      __userAuthenticationData: RequestUserAuthenticationData;

      /**
       * ## DO NOT USE
       * Internal framework data for authentication.
       *
       * Flag used for caching of authentication assertion check results, so
       * that multiple calls to the authentication assertion check function can
       * share the same result in a single request/response cycle.
       */
      __authenticationAssertionCheckPassed?: boolean;
    }
  }
}
