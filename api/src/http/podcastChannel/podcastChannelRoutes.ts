import type { PodcastEpisode, PodcastChannel } from "dto";

import express from "express";

import { apiDB, genPodcastEpisodeBaseQuery } from "../../kysely/index.js";
import { generateRssXml } from "../../rss/index.js";
import { authMiddleware } from "../auth/authMiddleware.js";

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

    res.status(200).json(channel satisfies PodcastChannel);
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

    res.status(200).json(episodes satisfies Array<PodcastEpisode>);
  })

  .get(
    "/v1/podcast/channel/:channelID/user-subscription-status",
    authMiddleware,
    async function (req, res) {
      const userID = req.authenticatedUser?.id!;
      const channelID = req.params["channelID"]!;

      const isSubscribed = await apiDB
        .selectFrom("user_subscription_to_podcast_channel")
        .select("id")
        .where("user_id", "=", userID)
        .where("podcast_channel_id", "=", channelID)
        .executeTakeFirst();

      if (isSubscribed === undefined) {
        res.status(200).json({
          subscribed: false,
        });
        return;
      }

      res.status(200).json({
        subscribed: true,
      });
    },
  )

  .post(
    "/v1/podcast/channel/:channelID/user-subscription-update",
    authMiddleware,
    async function (req, res) {
      const userID = req.authenticatedUser?.id!;
      const channelID = req.params["channelID"]!;
      const shouldSubscribe = req.body["subscribe"]!;

      if (shouldSubscribe) {
        await apiDB
          .insertInto("user_subscription_to_podcast_channel")
          .values({
            id: crypto.randomUUID(),
            created_at: $DateTime.now.asIsoDateTime(),
            user_id: userID,
            podcast_channel_id: channelID,
          })
          .execute();
      } else {
        await apiDB
          .deleteFrom("user_subscription_to_podcast_channel")
          .where("user_id", "=", userID)
          .where("podcast_channel_id", "=", channelID)
          .execute();
      }

      // As long as DB calls did not throw, assume it succeeded
      res.status(200).json({
        subscribed: shouldSubscribe,
      });
    },
  )

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

    // Because we always build this on the spot and it returns a lastBuildDate in the XML
    // the Etag is always different and caching doesnt work well
    // so we need to build this on new episode, then write to DB/cache this until the next write
    const feedXML = generateRssXml(channel, episodes);

    res.set("Content-Type", "application/rss+xml").status(200).send(feedXML);
  });
