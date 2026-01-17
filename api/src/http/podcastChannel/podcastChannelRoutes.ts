import type { Episode, Channel } from "dto";

import express from "express";

import { apiDB, genPodcastEpisodeBaseQuery } from "../../kysely/index.js";

export const podcastChannelRoutes = express
  .Router()

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
      // @todo Allow frontend to paginate with cursor? or offset?
      .limit(20)
      .execute();

    res.status(200).json(episodes satisfies Array<Episode>);
  });
