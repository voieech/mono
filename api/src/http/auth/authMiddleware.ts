import type { User } from "@workos-inc/node";
import type { Request, Response, NextFunction } from "express";

import { decodeAndVerifyJwtAccessTokenString } from "./decodeAndVerifyJwtAccessTokenString.js";

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

  const [err, _jwtPayload] =
    await decodeAndVerifyJwtAccessTokenString(encodedJwtString);

  if (err !== null) {
    res.status(403).json({
      error: err.message,
    });
    return;
  }

  next();
}
