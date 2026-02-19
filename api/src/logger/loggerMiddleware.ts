import type { Request, Response, NextFunction } from "express";

import { logger } from "./logger.js";

/**
 * Middleware to create a new request specific/bounded logger, and to log info
 * at the start and end of the request/response cycle.
 */
export async function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.logger = logger.child().withContext({
    requestID: req.id,

    // User details, especially the ID are logged in "context" instead of
    // "metadata", since this allows us to filter for "all logs for all requests
    // of a selected user" for debugging.
    // This is only included if user is authenticated, since there is no user ID
    // if user is not authenticated, e.g. a guest user.
    user: req.isUserAuthenticated
      ? {
          id: await req.genAuthenticatedUserID(),

          // No need to include this since user will ALWAYS be authenticated in
          // order for req.isUserAuthenticated to be set...
          // isAuthenticated: req.isUserAuthenticated,
        }
      : null,
  });

  // Log when request starts
  req.logger
    .withMetadata({
      req: {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        body: req.body,
        headers: req.headers,
        locales: req.locales,
      },
      connection: {
        originalIpAddress: req.originalIpAddress,
        remoteAddress: req.socket.remoteAddress,
        remotePort: req.socket.remotePort,
      },
    })
    .info("Req-Start");

  // Log when request ends
  res.on("finish", () => {
    req.logger
      .withMetadata({
        res: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },

        // Keep to "ms" precision
        responseTimeInMs: Math.trunc(performance.now() - req.startTime),
      })
      .info("Req-End");
  });

  next();
}
