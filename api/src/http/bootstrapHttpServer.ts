import type { Episode, Channel } from "dto";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { apiDB, genPodcastEpisodeBaseQuery } from "../kysely/index.js";
import { generateRssXml } from "../rss/index.js";
import { authRoutes } from "./auth/index.js";
import { localeMiddleware } from "./locale/index.js";

export function bootstrapHttpServer() {
  express()
    .disable("x-powered-by")

    .use(cors())

    .use(localeMiddleware)

    .use(cookieParser())

    .use(authRoutes)

    .get("/", (_, res) => {
      res.status(200).end("ok");
    })

    .get("/.well-known/apple-app-site-association", function (_, res) {
      // @todo Add cache headers
      res.status(200).json({
        applinks: {
          apps: [],
          details: [
            {
              appID: `${process.env["APPLE_TEAM_ID"]}.com.voieech-app`,
              paths: ["/podcast/channel/*", "/podcast/episode/*"],
            },
          ],
        },
      });
    })

    .get("/v1/podcast/featured/channel", async function (req, res) {
      const rawLimit = Number(req.query["limit"]);
      const limit = isNaN(rawLimit) || rawLimit === 0 ? 4 : rawLimit;

      if (limit < 1 || limit > 20) {
        res.status(400).json({
          error: "Limit must be between 1 and 20",
        });
        return;
      }

      const featuredChannels = await apiDB
        .selectFrom("podcast_channel")
        .selectAll()
        .where("language", "like", `${req.locale}%`)
        // @todo Ordery by popularity
        .limit(limit)
        .execute();

      res.status(200).json(featuredChannels satisfies Array<Channel>);
    })

    .get("/v1/podcast/featured/episodes", async function (req, res) {
      const rawLimit = Number(req.query["limit"]);
      const limit = isNaN(rawLimit) || rawLimit === 0 ? 4 : rawLimit;

      if (limit < 1 || limit > 20) {
        res.status(400).json({
          error: "Limit must be between 1 and 20",
        });
        return;
      }

      const featuredEpisodes = await genPodcastEpisodeBaseQuery()
        .groupBy([
          "podcast_episode.id",
          "audio.public_url",
          "audio.length",
          "podcast_channel.name",
        ])
        .where("podcast_episode.language", "like", `${req.locale}%`)
        // @todo Ordery by popularity
        .orderBy("podcast_episode.created_at", "desc")
        .limit(limit)
        .execute();

      res.status(200).json(featuredEpisodes satisfies Array<Episode>);
    })

    /**
     * Get a list of reccomendations to play next after a given podcast
     * episode's vanity ID.
     *
     * @todo things to try
     * 1. vector DB to store embedding of all the stuff user listened + liked
     * then show them relevant stuff?
     */
    .get("/v1/podcast/reccomendations/next", async function (req, res) {
      const rawLimit = Number(req.query["limit"]);
      const limit = isNaN(rawLimit) || rawLimit === 0 ? 5 : rawLimit;
      if (limit < 1 || limit > 20) {
        res.status(400).json({
          error: "'limit' must be between 1 and 20",
        });
        return;
      }

      const currentEpisodeVanityID = req.query["current_episode_vanity_id"];
      if (
        typeof currentEpisodeVanityID !== "string" ||
        currentEpisodeVanityID === undefined
      ) {
        res.status(400).json({
          error: "'current_episode_vanity_id' is invalid",
        });
        return;
      }

      const currentEpisode = await apiDB
        .selectFrom("podcast_episode")
        .selectAll("podcast_episode")
        .where("podcast_episode.vanity_id", "=", currentEpisodeVanityID)
        .executeTakeFirst();
      if (currentEpisode === undefined) {
        res.status(404).json({
          error: `Cannot find episode with VanityID: ${currentEpisodeVanityID}`,
        });
        return;
      }

      // @todo Filter out all episodes that the user listened to before
      // Get latest episodes from same channel as reccomendations for now
      const reccomendations = await genPodcastEpisodeBaseQuery()
        .limit(limit)
        .where("podcast_episode.channel_id", "=", currentEpisode.channel_id)
        // Filter out the current episode user is listening to
        .where("podcast_episode.id", "!=", currentEpisode.id)
        .orderBy("podcast_episode.created_at", "desc")
        .execute();

      res.status(200).json({
        reccomendations: reccomendations satisfies Array<Episode>,
      });
    })

    .get("/v1/podcast/episode/:vanityID", async function (req, res) {
      const vanityID = req.params.vanityID;

      const episode = await genPodcastEpisodeBaseQuery()
        .where("podcast_episode.vanity_id", "=", vanityID)
        .executeTakeFirst();

      if (episode === undefined) {
        res.status(404).json({
          error: `Cannot find episode with VanityID: ${vanityID}`,
        });
        return;
      }

      res.status(200).json(episode satisfies Episode);
    })

    .get("/v1/podcast/channel/:channelID", async function (req, res) {
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

      res.status(200).json(channel satisfies Channel);
    })

    .get("/v1/podcast/channel/:channelID/episodes", async function (req, res) {
      const channelID = req.params.channelID;

      const channel = await apiDB
        .selectFrom("podcast_channel")
        .select("id")
        .where("podcast_channel.id", "=", channelID)
        .executeTakeFirst();

      if (channel === undefined) {
        res.status(404).send(`Invalid Channel ID: ${channelID}`);
        return;
      }

      const episodes = await genPodcastEpisodeBaseQuery()
        .groupBy([
          "podcast_episode.id",
          "audio.public_url",
          "audio.length",
          "podcast_channel.name",
        ])
        .where("podcast_episode.channel_id", "=", channelID)
        .orderBy("podcast_episode.created_at", "desc")
        .limit(20)
        .execute();

      res.status(200).json(episodes satisfies Array<Episode>);
    })

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
        .limit(100)
        .execute();

      const feedXML = generateRssXml(channel, episodes);

      res.set("Content-Type", "application/rss+xml").status(200).send(feedXML);
    })

    .listen(process.env["PORT"] ?? 3000);
}
