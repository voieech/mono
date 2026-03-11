import type { Request } from "express";

import express from "express";

declare global {
  namespace Express {
    interface Request {
      /**
       * The raw request body buffer is conditionally (if needed) converted into
       * a utf-8 string and stored on the request object. This is for usecases
       * like signature verification.
       *
       * Update conditional check in `expressJsonBodyParserMiddleware` to set
       * this optionally.
       */
      rawBody?: string;
    }
  }
}

/**
 * Used globally instead of the `express.json()`, implementing additional
 * features such as conditionally storing the raw body stream as a string on
 * `req.rawBody` for use later on, for usecases like signature verification.
 */
export const expressJsonBodyParserMiddleware = express.json({
  verify(req: Request, _, rawRequestBodyBuffer) {
    if (req.path.startsWith("/qstash/webhooks")) {
      req.rawBody = rawRequestBodyBuffer.toString("utf-8");
    }
  },
});
