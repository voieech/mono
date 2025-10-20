import type { User } from "@workos-inc/node";
import type { Request, Response, NextFunction } from "express";

import {
  workos,
  WORKOS_COOKIE_NAME,
  WORKOS_COOKIE_PASSWORD,
} from "./workos.js";

// Add `user` to express Request type globally.
// Using optional User type since middleware might not be used for all APIs.
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to authenticate user before allowing them to move forward.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies[WORKOS_COOKIE_NAME],
    cookiePassword: WORKOS_COOKIE_PASSWORD,
  });

  const authenticationResponse = await session.authenticate();

  // If authenticated, set user object onto request object for use downstream
  if (authenticationResponse.authenticated) {
    req.user = authenticationResponse.user;
    next();
    return;
  }

  // If the cookie is missing, redirect to login
  if (
    !authenticationResponse.authenticated &&
    authenticationResponse.reason === "no_session_cookie_provided"
  ) {
    res.redirect("/auth/workos/login");
    return;
  }

  // If session is invalid, attempt to refresh and update cookie
  try {
    const refreshSessionResponse = await session.refresh();

    // If failed to refresh, redirect to get user to re-login
    if (!refreshSessionResponse.authenticated) {
      res.redirect("/auth/workos/login");
      return;
    }

    // Update cookie
    res.cookie(WORKOS_COOKIE_NAME, refreshSessionResponse.sealedSession, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    // Redirect user to the same route, so that the frontend/client will call
    // the route again to ensure the updated cookie is used
    res.redirect(req.originalUrl);
    return;
  } catch (e) {
    // Failed to refresh access token, redirect to login after deleting cookie
    res.clearCookie(WORKOS_COOKIE_NAME);
    res.redirect("/auth/workos/login");
    return;
  }
}
