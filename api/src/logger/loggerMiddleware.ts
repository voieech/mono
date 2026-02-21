import type { Request, Response, NextFunction } from "express";

import onFinished from "on-finished";

import { convertMaybeObjectToNullOrObject } from "../util/convertMaybeObjectToNullOrObject.js";
import { logger } from "./logger.js";

/**
 * Middleware to create a new request specific/bounded logger, and to log info
 * at the start and end of the request/response cycle.
 *
 * Advanced / edge case debugging uses:
 * 1. If there are requests coming in but never logged because it never hits
 * the "end" or finishes, you should add a log at the start of the request to
 * compare how many "open requests logs are there without a corresponding close"
 * and another way to do so is to use a timer to log after X seconds of
 * processing to warn about long processing time for that request.
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

  // Optionally support wrapping `res.json` and `res.send` to store the response
  // data in `res.locals` for logging for debugging purposes later on.
  if (shouldLogResponseDataForDebugging) {
    const resDotJson = res.json;
    res.json = function (data) {
      res.locals["DEBUG:res.json(data)"] = data;
      return resDotJson.call(res, data);
    };

    const resDotSend = res.send;
    res.send = function (data) {
      // Only save the data if it isnt already stored, since res.json internally
      // calls res.send so we prevent double storing and double logging data.
      if (res.locals["DEBUG:res.json(data)"] === undefined) {
        res.locals["DEBUG:res.send(data)"] = data;
      }
      return resDotSend.call(res, data);
    };
  }

  /**
   * Log when request ends only.
   *
   * Use onFinished to handle the end of the request life-cycle, instead of
   * manually handling things like `res.on("finish", ...)` and
   * `res.on("close", ...)`. This way i dont need to do manual cleanup,
   * preventing possible memory leaks.
   *
   * Pros of only logging at the end
   * - Atomic Context: In modern observability (using tools like Datadog, ELK,
   * or Grafana Loki), the goal is to have one event per transaction. Having one
   * log with all metadata allows you to build powerful dashboards, e.g.
   * "Average response time for User X on Route Y where Body contains Z" with a
   * single query.
   *
   * Pros of logging at start too
   * - Zombie Request Detection: If you see a Req-Start without a matching
   * Req-End, you know exactly where your app is crashing.
   * - In-Flight Visibility: If a request takes 30 seconds, you can verify it
   * started successfully while it is still processing.
   */
  onFinished(res, (err, res) => {
    const log = req.logger.withMetadata({
      // Keep to "ms" precision
      responseTimeInMs: Math.trunc(performance.now() - req.startTime),

      // Excludes the data already in the context object
      req: {
        // The route path pattern template. This is only set at the end since
        // this value is only populated at the end after ExpressJS has
        // successfully matched a route. This can be null if nothing matched,
        // i.e. a 404 route or a 500 error.
        routePattern: req.route?.path ?? null,
        method: req.method,
        url: req.url,

        // Convert potentially empty objects into null for better log
        // filtering/searching.
        query: convertMaybeObjectToNullOrObject(req.query),
        params: convertMaybeObjectToNullOrObject(req.params),

        headers: req.headers,
        locales: req.locales,

        // Note on `req.body` mutability, a.k.a the "ghost" body, where
        // middlewares and route handlers can modify req.body as the request
        // moves through the stack, which means that by the time this is ran at
        // the very end, our logs will show the modified body and not the
        // original body sent by the user.
        // A potential more expensive fix that we are not doing now is to clone
        // the object at the start of the request and logging that instead.
        // If `req.body` is undefined, convert it to null instead of leaving as
        // undefined since undefined will be scrubbed when logged.
        body: req.body ?? null,
      },

      connection: {
        originalIpAddress: req.originalIpAddress,
        remoteAddress: req.socket.remoteAddress,
        remotePort: req.socket.remotePort,
      },

      res: {
        statusCode: res.statusCode,
        headers: res.getHeaders(),

        // These are only logged for debugging purposes if turned on manually
        "DEBUG:res.json(data)": shouldLogResponseDataForDebugging
          ? (res.locals["DEBUG:res.json(data)"] ?? null)
          : undefined,
        "DEBUG:res.send(data)": shouldLogResponseDataForDebugging
          ? (res.locals["DEBUG:res.send(data)"] ?? null)
          : undefined,
      },
    });

    // Error info if on-finished detected a stream error
    if (err !== null) {
      log.withError(err);
    }

    log.info(res.writableFinished ? "Request Processed" : "Request Aborted");
  });

  next();
}

const shouldLogResponseDataForDebugging =
  process.env["LOG_RESPONSE_DATA_FOR_DEBUGGING"] === "true";
