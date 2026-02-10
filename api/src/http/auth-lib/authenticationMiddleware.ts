import type { Request, Response, NextFunction } from "express";

import { decodeAndVerifyJwtAccessTokenString } from "./decodeAndVerifyJwtAccessTokenString.js";
import { genAuthenticatedUser } from "./genAuthenticatedUser.js";
import { genAuthenticatedUserID } from "./genAuthenticatedUserID.js";
import { genAuthenticatedUserJwtPayload } from "./genAuthenticatedUserJwtPayload.js";
import { genAuthenticatedUserWorkosID } from "./genAuthenticatedUserWorkosID.js";

/**
 * Middleware to authenticate user (if user presents an authentication token)
 * and save the authentication results on the `req` object so that downstream
 * middlewares and route handlers can use this result to make decisions.
 */
export async function authenticationMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  // Attach methods to `req` object for loading authenticated user data
  // (assuming user is authenticated in the next steps) for downstream use.
  req.genAuthenticatedUser = genAuthenticatedUser.bind(req);
  req.genAuthenticatedUserID = genAuthenticatedUserID.bind(req);
  req.genAuthenticatedUserWorkosID = genAuthenticatedUserWorkosID.bind(req);
  req.genAuthenticatedUserJwtPayload = genAuthenticatedUserJwtPayload.bind(req);

  // Note that headers are lowercased by express
  if (req.headers.authorization === undefined) {
    req.__userAuthenticationData = {
      isAuthenticated: false,
      httpStatusCode: 401,
      reason: "Missing authorization header",
    };
    next();
    return;
  }

  const [authenticationScheme, encodedJwtString] =
    req.headers.authorization.split(" ");

  // Only Bearer Authentication Scheme is supported
  if (authenticationScheme !== "Bearer") {
    req.__userAuthenticationData = {
      isAuthenticated: false,
      httpStatusCode: 401,
      reason: "Expected Bearer Authentication Scheme",
    };
    next();
    return;
  }

  if (
    encodedJwtString === "" ||
    encodedJwtString === undefined ||
    encodedJwtString === "undefined" ||
    encodedJwtString === "null"
  ) {
    req.__userAuthenticationData = {
      isAuthenticated: false,
      httpStatusCode: 401,
      reason: "Missing valid authentication token",
    };
    next();
    return;
  }

  const [err, jwtPayload] =
    await decodeAndVerifyJwtAccessTokenString(encodedJwtString);

  if (err !== null) {
    req.__userAuthenticationData = {
      isAuthenticated: false,
      httpStatusCode: 403,
      reason: err.message,
    };
    next();
    return;
  }

  req.__userAuthenticationData = {
    isAuthenticated: true,
    jwtPayload,
  };
  next();
}
