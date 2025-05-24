import "./global/bootstrapGlobalDefinitions.js";

import { bootstrapHttpServer } from "./http/bootstrapHttpServer.js";

function mainEntrypoint() {
  bootstrapHttpServer();
}

mainEntrypoint();
