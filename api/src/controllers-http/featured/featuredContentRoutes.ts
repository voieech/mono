import type { PodcastEpisode, PodcastChannel } from "dto";

import express from "express";
import { sql } from "kysely";

import { InvalidInputException } from "../../exceptions/index.js";
import { apiDB, genPodcastEpisodeBaseQuery } from "../../kysely/index.js";

export const featuredContentRoutes = express
  .Router()

  .get("/v1/podcast/featured/channel", async function (req, res) {
    const rawLimit = Number(req.query["limit"]);
    const limit = isNaN(rawLimit) || rawLimit === 0 ? 4 : rawLimit;

    if (limit < 1 || limit > 20) {
      throw new InvalidInputException("Limit must be between 1 and 20");
    }

    const featuredChannels = await apiDB
      .selectFrom("podcast_channel")
      .selectAll()
      .where((eb) =>
        eb.or(
          req.locales.map((locale) => eb("language", "like", `${locale}%`)),
        ),
      )
      // @todo Ordery by popularity
      .orderBy(sql`random()`)
      .limit(limit)
      .execute();

    res.status(200).json(featuredChannels satisfies Array<PodcastChannel>);
  })

  .get("/v1/podcast/featured/episodes", async function (req, res) {
    const rawLimit = Number(req.query["limit"]);
    const limit = isNaN(rawLimit) || rawLimit === 0 ? 4 : rawLimit;

    if (limit < 1 || limit > 20) {
      throw new InvalidInputException("Limit must be between 1 and 20");
    }

    const featuredEpisodes = await genPodcastEpisodeBaseQuery()
      .groupBy([
        "podcast_episode.id",
        "audio.public_url",
        "audio.length",
        "podcast_channel.name",
      ])
      .where((eb) =>
        eb.or(
          req.locales.map((locale) =>
            eb("podcast_episode.language", "like", `${locale}%`),
          ),
        ),
      )
      // @todo Ordery by popularity
      .orderBy("podcast_episode.created_at", "desc")
      .limit(limit)
      .execute();

    res.status(200).json(featuredEpisodes satisfies Array<PodcastEpisode>);
  });
