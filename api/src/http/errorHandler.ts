import type { Request, Response, NextFunction } from "express";

import { convertUnknownCatchToError } from "convert-unknown-catch-to-error";

import { HttpTransformerableException } from "../exceptions/index.js";
import { HttpStatus } from "./HttpStatus.js";
import { JSendError } from "./JSend.js";

/**
 * Error handling middleware to respond to user when an error is being thrown
 * from within an express route handler.
 *
 * This needs to be the very last middleware/handler in the express app, to
 * catch anything thrown in previous middleware/handlers.
 *
 * First parameter is of unknown type because anything can be thrown.
 */
export function errorHandler(
  e: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const error = convertUnknownCatchToError(e);

  // Adding optional chaining to this entire call chain, since there is a chance
  // that req.logger is not attached before errorHandler is called. E.g. when
  // an error is thrown in a middleware that runs before loggerMiddleware or if
  // the loggerMiddleware itself threw an error.
  req?.logger
    ?.withError(error)
    ?.withMetadata({
      // This is attached for debugging when there is an error because req.body
      // is not logged by default to reduce log size and to prevent leaking PII
      // during normal operations.
      requestBodyForDebuggingOnError: req.body,
    })
    ?.error(error.message);

  if (error instanceof HttpTransformerableException) {
    const { httpStatusCode, jsendData } = error.transformToHttpResponseData();
    res.status(httpStatusCode).json(jsendData);
    return;
  }

  // If it is an unknown error type
  res.status(HttpStatus.InternalServerError_500).json({
    status: "error",
    message: "Internal Server Error!",
    data: [`ID: ${req.id}`, error.message],
  } satisfies JSendError);
}
