import "./global/bootstrapGlobalDefinitions.js";
import { bootstrapHttpServer } from "./bootstrapHttpServer.js";

function mainEntrypoint() {
  bootstrapHttpServer();
}

mainEntrypoint();
