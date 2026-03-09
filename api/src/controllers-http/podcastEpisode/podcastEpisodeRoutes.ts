import type { PodcastEpisode } from "dto";

import express from "express";

import { podcastEpisodeRepo } from "../../dal/index.js";
import { NotFoundException } from "../../exceptions/index.js";

export const podcastEpisodeRoutes = express
  .Router()

  .get("/v1/podcast/episode/:id", async function (req, res) {
    const id = req.params.id;

    const episode = await podcastEpisodeRepo.getPodcastEpisodeByID(id);

    if (episode === undefined) {
      throw new NotFoundException(`Cannot find episode with ID: ${id}`);
    }

    res.status(200).json(episode satisfies PodcastEpisode);
  });
