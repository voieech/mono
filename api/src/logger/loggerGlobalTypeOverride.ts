import type { LogLayer } from "loglayer";

declare global {
  namespace Express {
    interface Request {
      /**
       * A unique LogLayer logger is created for every request with its context
       * populated with the request data, and attached to the request object in
       * the logging middleware.
       */
      logger: LogLayer;
    }
  }
}
