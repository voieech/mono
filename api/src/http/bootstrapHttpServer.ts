import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { authRoutes, authWebhookRoutes } from "./auth/index.js";
import { createRoutes } from "./create/index.js";
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

    .use(localeMiddleware)
    .use(cookieParser())
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

    .listen(process.env["PORT"] ?? 3000);
}
