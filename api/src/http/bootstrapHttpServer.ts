import cors from "cors";
import express from "express";
import rss from "rss";

import { createDB } from "../kysely/createDB.js";

export function bootstrapHttpServer() {
  const apiDB = createDB({
    connectionString: process.env["DATABASE_URL"]!,
  });

  express()
    .use(cors())

    .get("/", (_, res) => {
      res.status(200).end("ok");
    })

    .get("/v1/landing/featured-episodes", async function (req, res) {
      const requestedLanguage = req.query["lang"]?.toString() ?? "en";

      // @todo
      // Check if language is a valid option first before even attempting to
      // querying DB, instead of relying on the DB query to check if language is
      // valid. Use $LanguageCode.makeStrongSafely, and fall back to en if none
      const isRequestedLanguageAvailable = true;

      const language = isRequestedLanguageAvailable ? requestedLanguage : "en";

      const featuredEpisodes = await apiDB
        .selectFrom("podcast_episode")
        .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
        .select([
          "podcast_episode.vanity_id",
          "podcast_episode.created_at",
          "podcast_episode.title",
          "podcast_episode.language",
          "audio.length as audio_length",
        ])
        .where("podcast_episode.language", "=", language)
        .orderBy("podcast_episode.created_at", "desc")
        .limit(4)
        .execute()
        .then((episodes) =>
          episodes.map((episode) => ({
            vanityID: episode.vanity_id,
            createdAt: episode.created_at,
            title: episode.title,
            language: episode.language,
            audioLength: episode.audio_length,
          })),
        );

      // @todo
      // Cache featuredEpisodes so that not every landing page load causes a DB
      // query. Cache in upstash or something with a builtin TTL...

      res.status(200).json(featuredEpisodes);
    })

    .get("/v1/episode/:vanityID", async function (req, res) {
      const vanityID = req.params.vanityID;

      const episode = await apiDB
        .selectFrom("podcast_episode")
        .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
        .selectAll("podcast_episode")
        .select([
          "audio.public_url as audio_public_url",
          "audio.length as audio_length",
        ])
        .where("podcast_episode.vanity_id", "=", vanityID)
        .executeTakeFirst();

      if (episode === undefined) {
        res.status(404).json({
          error: `Cannot find episode with VanityID: ${vanityID}`,
        });
        return;
      }

      const externallyHostedLinks = await apiDB
        .selectFrom("podcast_episode_externally_hosted_link")
        .select(["podcast_platform", "url"])
        .where("podcast_episode_id", "=", episode.id)
        .execute();

      res.status(200).json({
        id: episode.id,
        createdAt: episode.created_at,
        vanityID: episode.vanity_id,
        episodeNumber: episode.episode_number,
        audioPublicUrl: episode.audio_public_url,
        audioLength: episode.audio_length,
        language: episode.language,
        title: episode.title,
        description: episode.description,
        externallyHostedLinks,
      });
    })

    .get("/v1/rss/:channelID", async function (req, res) {
      const channelID = req.params.channelID;

      const channel = await apiDB
        .selectFrom("podcast_channel")
        .selectAll()
        .where("podcast_channel.id", "=", channelID)
        .executeTakeFirst();

      if (channel === undefined) {
        res.status(404).end(`Invalid Channel ID: ${channelID}`);
        return;
      }

      const episodes = await apiDB
        .selectFrom("podcast_episode")
        .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
        .selectAll("podcast_episode")
        .select([
          "audio.public_url as audio_public_url",
          "audio.length as audio_length",
        ])
        .where("channel_id", "=", channelID)
        .orderBy("podcast_episode.created_at", "desc")
        .limit(20)
        .execute();

      const feed = new rss({
        // @todo Generate link to self
        site_url: `https://www.voieech.com`,
        language: channel.language,
        title: channel.name,
        description: channel.description,

        // @todo Generate link to self
        feed_url: `https://www.voieech.com`,

        // @todo
        // categories: [],
        // image_url: "",
        // ttl: 60 // in minutes
        // copyright: "",

        // Override library defaults
        generator: "voieech",
      });

      for (const episode of episodes) {
        feed.item({
          guid: episode.id,
          // @todo Use a URL builder
          url: `https://www.voieech.com/e/${episode.vanity_id}?lang=${episode.language}`,
          date: episode.created_at,
          title: episode.title,
          description: episode.description,
          categories: [],
        });
      }

      res.status(200).end(feed.xml());
    })

    .listen(process.env["PORT"] ?? 3000);
}
