import "./global/bootstrapGlobalDefinitions.js";
import { bootstrapHttpServer } from "./bootstrapHttpServer.js";
import { setupGlobalCrashHandler } from "./setupGlobalCrashHandler.js";

function mainEntrypoint() {
  setupGlobalCrashHandler();
  bootstrapHttpServer();
}

mainEntrypoint();
