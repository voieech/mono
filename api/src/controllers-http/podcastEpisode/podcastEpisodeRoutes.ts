import type { PodcastEpisode } from "dto";

import express from "express";

import { genPodcastEpisodeBaseQuery } from "../../kysely/index.js";

export const podcastEpisodeRoutes = express
  .Router()

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

    res.status(200).json(episode satisfies PodcastEpisode);
  });
