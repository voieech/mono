import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { additionalRequestContextMiddleware } from "./additionalRequestContextMiddleware/index.js";
import {
  authRoutes,
  authWebhookRoutes,
} from "./controllers-http/auth/index.js";
import { createRoutes } from "./controllers-http/create/index.js";
import { featuredContentRoutes } from "./controllers-http/featured/index.js";
import { localeMiddleware } from "./controllers-http/locale/index.js";
import { appleAppSiteAssociationRoute } from "./controllers-http/others/index.js";
import { contactFormRoutes } from "./controllers-http/others/index.js";
import { podcastChannelRoutes } from "./controllers-http/podcastChannel/index.js";
import { podcastEpisodeRoutes } from "./controllers-http/podcastEpisode/index.js";
import { recommendationsRoutes } from "./controllers-http/reccomendations/index.js";
import { userRoutes } from "./controllers-http/user/index.js";
import { authenticationMiddleware, errorHandler } from "./http/index.js";
import { loggerMiddleware } from "./logger/index.js";

export function bootstrapHttpServer() {
  express()
    .disable("x-powered-by")

    .use(cors())

    // Health check route is placed at the top to skip all the heavy/expensive
    // middlewares that are not needed.
    .get("/", (_, res) => {
      res.status(200).end("ok");
    })

    /* Global Middlewares */
    // Attaches a unique request ID onto `req` for use downstream.
    .use(additionalRequestContextMiddleware)
    // Cookie parser used for cookied based web app auth
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
    // Logger middleware uses data on the request object set by
    // `additionalRequestContextMiddleware`, `authenticationMiddleware` and
    // `localeMiddleware`, so this middleware can only be used/placed after them
    .use(loggerMiddleware)

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
    .use(contactFormRoutes)

    /**
     * Very last handler is the error handler to catch anything thrown by items
     * in the stack above.
     */
    .use(errorHandler)

    .listen(process.env["PORT"] ?? 3000);
}
