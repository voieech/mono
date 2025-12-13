import type { Request, Response, NextFunction } from "express";

// jwtMiddleware.ts
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./jwt.js";

export interface JwtUser {
  id: string;
  email: string;
}

// Add `JwtUser` to express Request type globally.
// Using optional JwtUser type since middleware might not be used for all APIs.
declare global {
  namespace Express {
    interface Request {
      jwtUser?: JwtUser;
    }
  }
}

export function requireJwt(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ user: null });
    return;
  }

  try {
    const token = auth.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET) as any;

    req.jwtUser = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch {
    res.status(401).json({ user: null });
    return;
  }
}
