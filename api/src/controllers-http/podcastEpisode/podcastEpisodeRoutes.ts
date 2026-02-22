import type { PodcastEpisode } from "dto";

import express from "express";

import { NotFoundException } from "../../exceptions/index.js";
import { genPodcastEpisodeBaseQuery } from "../../kysely/index.js";

export const podcastEpisodeRoutes = express
  .Router()

  .get("/v1/podcast/episode/:id", async function (req, res) {
    const id = req.params.id;

    const episode = await genPodcastEpisodeBaseQuery()
      .where("podcast_episode.id", "=", id)
      .executeTakeFirst();

    if (episode === undefined) {
      throw new NotFoundException(`Cannot find episode with ID: ${id}`);
    }

    res.status(200).json(episode satisfies PodcastEpisode);
  });
