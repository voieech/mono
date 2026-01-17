import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { apiDB } from "../kysely/index.js";
import { generateRssXml } from "../rss/index.js";
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

    .get("/v1/podcast/channel/rss/:channelID", async function (req, res) {
      const channelID = req.params.channelID;

      const channel = await apiDB
        .selectFrom("podcast_channel")
        .selectAll()
        .where("podcast_channel.id", "=", channelID)
        .executeTakeFirst();

      if (channel === undefined) {
        res.status(404).send(`Invalid Channel ID: ${channelID}`);
        return;
      }

      const episodes = await apiDB
        .selectFrom("podcast_episode")
        .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
        .selectAll("podcast_episode")
        .select([
          "audio.public_url as audio_public_url",
          "audio.length as audio_length",
          "audio.mime_type as audio_mime_type",
          "audio.size as audio_size",
        ])
        .where("channel_id", "=", channelID)
        .orderBy("podcast_episode.created_at", "desc")
        .limit(50)
        .execute();

      const feedXML = generateRssXml(channel, episodes);

      res.set("Content-Type", "application/rss+xml").status(200).send(feedXML);
    })

    .listen(process.env["PORT"] ?? 3000);
}
