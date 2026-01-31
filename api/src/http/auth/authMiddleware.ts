import type { Request, Response, NextFunction } from "express";

import type { DatabaseUser } from "../../kysely/index.js";
import type { JwtPayload } from "./jwtPayloadSchema.js";

import { apiDB } from "../../kysely/index.js";
import { decodeAndVerifyJwtAccessTokenString } from "./decodeAndVerifyJwtAccessTokenString.js";

/**
 * Data loaded from the DB User table after authenticating user's identity.
 */
type AuthenticatedUser = Pick<
  DatabaseUser,
  | "id"
  | "workos_id"
  | "created_at"
  | "email"
  | "email_verified"
  | "locale"
  | "first_name"
  | "last_name"
>;

declare global {
  namespace Express {
    interface Request {
      /**
       * This property is attached by the `authMiddleware` so only routes with
       * this middleware before it will have this.
       *
       * The decoded and verified JWT payload.
       */
      jwtPayload?: JwtPayload;

      /**
       * This property is attached by the `authMiddleware` so only routes with
       * this middleware before it will have this.
       *
       * This is the user data loaded from DB upon successful authentication,
       * which can be used for authorization checks by subsequent API handlers.
       */
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware to authenticate user before allowing them to move forward.
 *
 * @todo
 * Support optional Token Introspection API call / DB check to verify token is
 * still valid / not expired since our token are long lived, for sensitive paths.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Note that headers are lowercased by express
  if (req.headers.authorization === undefined) {
    res.status(401).json({
      error: "Missing authorization header",
    });
    return;
  }

  const [authenticationScheme, encodedJwtString] =
    req.headers.authorization.split(" ");

  // Only Bearer Authentication Scheme is supported
  if (authenticationScheme !== "Bearer") {
    res.status(401).json({
      error: "Expected Bearer Authentication Scheme",
    });
    return;
  }

  if (
    encodedJwtString === "" ||
    encodedJwtString === undefined ||
    encodedJwtString === "undefined" ||
    encodedJwtString === "null"
  ) {
    res.status(401).json({
      error: "Missing authentication token",
    });
    return;
  }

  const [err, jwtPayload] =
    await decodeAndVerifyJwtAccessTokenString(encodedJwtString);

  if (err !== null) {
    res.status(403).json({
      error: err.message,
    });
    return;
  }

  // @todo Token introspection API call
  // Since JWT can be very long lived in our case, we need to either do token
  // introspection or support using DB to block users if needed.
  // const userFromWorkos = await workos.userManagement.getUser(jwtPayload.sub);

  // Optimised to query only what we need for majority of API handlers instead
  // of the full user table row
  const userFromDB: AuthenticatedUser | undefined = await apiDB
    .selectFrom("user")
    .select([
      "id",
      "workos_id",
      "created_at",
      "email",
      "email_verified",
      "locale",
      "first_name",
      "last_name",
    ])
    .where("workos_id", "=", jwtPayload.sub)
    .executeTakeFirst();

  if (userFromDB === undefined) {
    res.status(403).json({
      error: `User does not exist`,
    });
    return;
  }

  // Attach values to req object for downstream use.
  req.jwtPayload = jwtPayload;
  req.authenticatedUser = userFromDB;

  next();
}
