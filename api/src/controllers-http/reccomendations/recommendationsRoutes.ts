import type { PodcastEpisode } from "dto";

import express from "express";

import {
  InvalidInputException,
  NotFoundException,
} from "../../exceptions/index.js";
import { apiDB, genPodcastEpisodeBaseQuery } from "../../kysely/index.js";

export const recommendationsRoutes = express
  .Router()

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
      throw new InvalidInputException("'limit' must be between 1 and 20");
    }

    const currentEpisodeVanityID = req.query["current_episode_vanity_id"];
    if (
      typeof currentEpisodeVanityID !== "string" ||
      currentEpisodeVanityID === undefined
    ) {
      throw new InvalidInputException("'current_episode_vanity_id' is invalid");
    }

    const currentEpisode = await apiDB
      .selectFrom("podcast_episode")
      .selectAll("podcast_episode")
      .where("podcast_episode.vanity_id", "=", currentEpisodeVanityID)
      .executeTakeFirst();
    if (currentEpisode === undefined) {
      throw new NotFoundException(
        `Cannot find episode with VanityID: ${currentEpisodeVanityID}`,
      );
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
      reccomendations: reccomendations satisfies Array<PodcastEpisode>,
    });
  });
