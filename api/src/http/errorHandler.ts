import type { Request, Response } from "express";

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
  _: Request,
  res: Response,
  _next: never,
) {
  const error = convertUnknownCatchToError(e);

  // @todo Should be generated / fed to the logging system
  // Create a error ID, to log it together with the error and send it back to
  // the client to improve debugging.
  const errorID = crypto.randomUUID();

  // @todo Log to betterstack or something
  // eslint-disable-next-line no-console
  console.error(`Error[${new Date().toISOString()}-${errorID}]: `, error);

  if (error instanceof HttpTransformerableException) {
    const { httpStatusCode, jsendData } = error.transformToHttpResponseData();
    res.status(httpStatusCode).json(jsendData);
    return;
  }

  // If it is an unknown error type
  res.status(HttpStatus.InternalServerError_500).json({
    status: "error",
    message: "Internal Server Error!",
    data: [`ID: ${errorID}`, error.message],
  } satisfies JSendError);
}
