declare global {
  namespace Express {
    interface Request {
      /**
       * A unique request ID.
       */
      id: string;

      /**
       * Start time of the request measured using `performance.now`, this is not
       * a wall clock time, it is a monotonic clock / counter with ms precision.
       */
      startTime: number;

      /**
       * The original IP address, with best effort estimation
       */
      originalIpAddress: string;
    }
  }
}
