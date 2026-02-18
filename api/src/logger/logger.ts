import { PinoTransport } from "@loglayer/transport-pino";
import { LogLayer } from "loglayer";

import { pinoLogger } from "./pinoLogger.js";
import { redactionPlugin } from "./redactionPlugin.js";

/**
 * LogLayer logger, which uses Pino as its underlying "transport"
 */
export const logger = new LogLayer({
  // Context will always be logged at top level, while metadata will be logged
  // in the "meta" object to cleanly denote what data is part of the context and
  // what is part of the specific log's metadata.
  metadataFieldName: "meta",

  // Use Pino to write to stdout instead of using a log aggregator transport
  // directly, since it is more efficient to write to stdout and get Digital
  // Ocean to do log forwarding to log aggregators like "betterstack.com".
  // No pretty print is used in production since these services need raw JSON.
  transport: new PinoTransport({
    logger: pinoLogger,
  }),

  plugins: [redactionPlugin],
});
