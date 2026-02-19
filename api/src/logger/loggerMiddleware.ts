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

    // High level request details, especially method and path are logged in
    // "context" instead of "metadata", since this allows us to filter for "all
    // logs for all requests of this specific route path + path params (if any)"
    // for debugging.
    req: {
      method: req.method,
      path: req.path,
    },

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
      // Excludes the data already in the context object
      req: {
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
        req: {
          // The route path pattern template. This is only set at the end since
          // this value is only populated at the end after ExpressJS has
          // successfully matched a route. This can be null if nothing matched,
          // i.e. a 404 route or a 500 error.
          routePattern: req.route?.path ?? null,
        },

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
