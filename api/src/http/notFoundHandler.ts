import type { Request, Response, NextFunction } from "express";

import { NotFoundException } from "../exceptions/index.js";

/**
 * 404 route not found handler to throw the `NotFoundException` for errorHandler
 * to process.
 */
export function notFoundHandler(
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  throw new NotFoundException("Route Not Found", [
    `${req.method} ${req.url} does not exist`,
  ]);
}
