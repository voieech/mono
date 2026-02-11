import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { authenticationMiddleware } from "./auth-lib/index.js";
import { authRoutes, authWebhookRoutes } from "./auth/index.js";
import { createRoutes } from "./create/index.js";
import { errorHandler } from "./errorHandler.js";
import { featuredContentRoutes } from "./featured/index.js";
import { localeMiddleware } from "./locale/index.js";
import { appleAppSiteAssociationRoute } from "./others/index.js";
import { podcastChannelRoutes } from "./podcastChannel/index.js";
import { podcastEpisodeRoutes } from "./podcastEpisode/index.js";
import { recommendationsRoutes } from "./reccomendations/index.js";
import { userRoutes } from "./user/index.js";

export function bootstrapHttpServer() {
  express()
    .disable("x-powered-by")

    .use(cors())

    .get("/", (_, res) => {
      res.status(200).end("ok");
    })

    /* Global Middlewares */
    .use(cookieParser())
    // Authenticate user and stores the result for downstream middlewares and
    // route handler to do detailed authentication and authorisation checks.
    .use(authenticationMiddleware)
    // Parses the requested locale and set it on `req` before any downstream
    // route handlers can use it.
    .use(localeMiddleware)
    // Setting this last so that we only parse req.body when absolutely
    // necessary to prevent wasting resources parsing it if it is going to fail
    // the auth check and etc...
    .use(express.json())

    /* Routes */
    .use(authWebhookRoutes)
    .use(authRoutes)
    .use(userRoutes)
    .use(createRoutes)
    .use(appleAppSiteAssociationRoute)
    .use(featuredContentRoutes)
    .use(recommendationsRoutes)
    .use(podcastEpisodeRoutes)
    .use(podcastChannelRoutes)

    /**
     * Very last handler is the error handler to catch anything thrown by items
     * in the stack above.
     */
    .use(errorHandler)

    .listen(process.env["PORT"] ?? 3000);
}
