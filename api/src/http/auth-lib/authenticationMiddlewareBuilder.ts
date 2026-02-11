import type { Request, Response, NextFunction } from "express";

import { workos } from "../../workos/index.js";
import { authenticationAssertionCheck } from "./authenticationAssertionCheck.js";

/**
 * Simple middleware that is reusable, to just ensure that the user is
 * authenticated without any further checks.
 */
function middlewareAllowAuthenticatedUserOnly(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  authenticationAssertionCheck(req);
  next();
}

/**
 * Factory function to build a route specific authentication middleware, to
 * enforce that only authenticated users can access that route.
 *
 * This also takes in arguments to do more declarative authentication and simple
 * authorization checks at the middleware level instead of doing them within the
 * route handler itself.
 */
export function authenticationMiddlewareBuilder(config?: {
  /**
   * Support optional Token Introspection API call / DB check to verify token is
   * still valid / not expired since our token are long lived, especially
   * useful for sensitive/destructive APIs.
   */
  verifyTokenValidity?: boolean;

  /**
   * Preload the authenticated user from DB to make it easier to use downstream.
   * Avoid using this unless necessary so that you can load data as needed
   * lazily.
   */
  preloadAuthenticatedUserFromDB?: boolean;

  // @todo Support passing in predicate functions

  // @todo Support passing in roles requirement
}) {
  // If no custom config used, return the common and simpler base middleware to
  // just ensure that user is authenticated.
  if (config === undefined) {
    return middlewareAllowAuthenticatedUserOnly;
  }

  // Create a new custom authentication middleware using user's config
  return async function (req: Request, _: Response, next: NextFunction) {
    authenticationAssertionCheck(req);

    // Since JWT can be very long lived in our case, sensitive APIs can use this
    // to do a "WorkOS token introspection API call" to ensure that the token is
    // still valid.
    // This would allow blocking of users / deleting users, and not allow them
    // to take anymore action even if their token hasnt expired yet. If not
    // doing this, we need to use DB to support blocking of users.
    if (config.verifyTokenValidity) {
      // @todo Store the returned user object in req for use downstream?
      // @todo Perhaps this can be yet another gen"AuthenticatedUser..." method
      await req
        .genAuthenticatedUserWorkosID()
        .then(workos.userManagement.getUser);
    }

    if (config.preloadAuthenticatedUserFromDB) {
      await req.genAuthenticatedUser();
    }

    // If there is no roles required, allow request immediately
    // if (requiredRoles.length === 0) return true;
    // // Get the roles value out from the custom claims object on the JWT
    // const roles = jwt[CustomClaimsKeys.roles];
    // // Validate the JWT `roles` claim with a type predicate
    // if (!isRoles(roles))
    //   throw new UnauthorizedException('Invalid "roles" claim in JWT');
    // // Check if user's role(s) matches any one of the required roles.
    // // Return true on first matching role
    // for (const requiredRole of requiredRoles)
    //   if (roles.includes(requiredRole)) return true;
    // None of the user's role(s) match any of the required roles
    // return false;
    next();
  };
}
