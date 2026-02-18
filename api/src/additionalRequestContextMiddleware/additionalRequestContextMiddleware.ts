import type { Request, Response, NextFunction } from "express";

/**
 * Middleware to add additional context to the request object for use by
 * downstream middlewares / route handlers.
 */
export async function additionalRequestContextMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  req.startTime = performance.now();

  req.id = crypto.randomUUID();

  // By default use DigitalOcean's specific header for the true client IP
  req.originalIpAddress = (
    req.headers["do-connecting-ip"] ??
    req.headers["x-forwarded-for"] ??
    req.ip ??
    ""
  ).toString();

  next();
}
