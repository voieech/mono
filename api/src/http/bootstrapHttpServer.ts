import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { authRoutes } from "./auth/index.js";
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

    .use(localeMiddleware)

    .use(cookieParser())
    // Middleware to parse json request body
    .use(express.json())

    .get("/", (_, res) => {
      res.status(200).end("ok");
    })

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
