import pino from "pino";

const isProduction = process.env["NODE_ENV"] === "production";

/**
 * Pino logger.
 *
 * ## DO NOT USE DIRECTLY
 * Do not use this logger directly, use the `LogLayer` logger instead.
 */
export const pinoLogger = pino(
  isProduction
    ? {
        level: "info",

        // Defaults to pino's standard JSON output for production
        // transport: undefined,
      }
    : {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",

            // Clean up dev output
            ignore: "pid,hostname",
          },
        },
      },
);
