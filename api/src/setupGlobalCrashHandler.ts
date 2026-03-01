import { logger } from "./logger/index.js";

export function setupGlobalCrashHandler() {
  // This just logs the crash, but since it is registered as handlers for those
  // global crashes, it prevents the process from exiting so it will be able to
  // keep handling incoming requests.
  function handleCrash(crashType: string, error: unknown) {
    logger.withError(error).fatal(`Process exiting due to ${crashType}`);

    // @todo Not exiting, just logging the issue and allowing things to continue
    // process.exit(1);
  }

  process.on("uncaughtException", (err) =>
    handleCrash("uncaughtException", err),
  );
  process.on("unhandledRejection", (reason) =>
    handleCrash("unhandledRejection", reason),
  );
}
