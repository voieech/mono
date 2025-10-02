import type { Episode, Channel, PodcastPlatform } from "dto";

import cors from "cors";
import express from "express";
import * as kyselyPostgresHelpers from "kysely/helpers/postgres";

import { apiDB } from "../kysely/apiDB.js";
import { generateRssXml } from "../rss/index.js";
import { localeMiddleware } from "./locale/index.js";

export function bootstrapHttpServer() {
  express()
    .disable("x-powered-by")

    .use(cors())

    .use(localeMiddleware)

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
      const rawCount = Number(req.query["count"]);
      const count = isNaN(rawCount) || rawCount === 0 ? 4 : rawCount;

      if (count < 1 || count > 20) {
        res.status(400).json({
          error: "Count must be between 1 and 20",
        });
        return;
      }

      const featuredChannels = await apiDB
        .selectFrom("podcast_channel")
        .selectAll()
        .where("language", "like", `${req.locale}%`)
        // @todo Ordery by popularity
        .limit(count)
        .execute();

      res.status(200).json(featuredChannels satisfies Array<Channel>);
    })

    .get("/v1/podcast/featured/episodes", async function (req, res) {
      const rawCount = Number(req.query["count"]);
      const count = isNaN(rawCount) || rawCount === 0 ? 4 : rawCount;

      if (count < 1 || count > 20) {
        res.status(400).json({
          error: "Count must be between 1 and 20",
        });
        return;
      }

      const featuredEpisodes = await apiDB
        .selectFrom("podcast_episode")
        .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
        .leftJoin(
          "podcast_episode_externally_hosted_link",
          "podcast_episode.id",
          "podcast_episode_externally_hosted_link.podcast_episode_id",
        )
        .selectAll("podcast_episode")
        .select([
          "audio.public_url as audio_public_url",
          "audio.length as audio_length",
        ])
        .select((eb) =>
          kyselyPostgresHelpers
            .jsonArrayFrom(
              eb
                .selectFrom("podcast_episode_externally_hosted_link")
                .select([
                  "podcast_episode_externally_hosted_link.url",
                  "podcast_episode_externally_hosted_link.podcast_platform",
                ])
                .$castTo<{
                  podcast_platform: PodcastPlatform;
                  url: string;
                }>()
                .whereRef(
                  "podcast_episode_externally_hosted_link.podcast_episode_id",
                  "=",
                  eb.ref("podcast_episode.id"),
                ),
            )
            .$notNull()
            .as("externally_hosted_links"),
        )
        .groupBy(["podcast_episode.id", "audio.public_url", "audio.length"])
        .where("podcast_episode.language", "like", `${req.locale}%`)
        // @todo Ordery by popularity
        .orderBy("podcast_episode.created_at", "desc")
        .limit(count)
        .execute();

      res.status(200).json(featuredEpisodes satisfies Array<Episode>);
    })

    .get("/v1/podcast/episode/:vanityID", async function (req, res) {
      const vanityID = req.params.vanityID;

      const episode = await apiDB
        .selectFrom("podcast_episode")
        .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
        .leftJoin(
          "podcast_episode_externally_hosted_link",
          "podcast_episode.id",
          "podcast_episode_externally_hosted_link.podcast_episode_id",
        )
        .selectAll("podcast_episode")
        .select([
          "audio.public_url as audio_public_url",
          "audio.length as audio_length",
        ])
        .select((eb) =>
          kyselyPostgresHelpers
            .jsonArrayFrom(
              eb
                .selectFrom("podcast_episode_externally_hosted_link")
                .select([
                  eb
                    .ref(
                      "podcast_episode_externally_hosted_link.podcast_platform",
                    )
                    .$notNull()
                    .as("podcast_platform"),
                  eb
                    .ref("podcast_episode_externally_hosted_link.url")
                    .$notNull()
                    .as("url"),
                ])
                .whereRef(
                  "podcast_episode_externally_hosted_link.podcast_episode_id",
                  "=",
                  eb.ref("podcast_episode.id"),
                ),
            )
            .as("externally_hosted_links"),
        )
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

    .get("/v1/podcast/channel/episodes/:channelID", async function (req, res) {
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

      const episodes = await apiDB
        .selectFrom("podcast_episode")
        .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
        .leftJoin(
          "podcast_episode_externally_hosted_link",
          "podcast_episode.id",
          "podcast_episode_externally_hosted_link.podcast_episode_id",
        )
        .selectAll("podcast_episode")
        .select([
          "audio.public_url as audio_public_url",
          "audio.length as audio_length",
        ])
        .select((eb) =>
          kyselyPostgresHelpers
            .jsonArrayFrom(
              eb
                .selectFrom("podcast_episode_externally_hosted_link")
                .select([
                  "podcast_episode_externally_hosted_link.podcast_platform",
                  "podcast_episode_externally_hosted_link.url",
                ])
                .$castTo<{
                  podcast_platform: PodcastPlatform;
                  url: string;
                }>()
                .whereRef(
                  "podcast_episode_externally_hosted_link.podcast_episode_id",
                  "=",
                  eb.ref("podcast_episode.id"),
                ),
            )
            .as("externally_hosted_links"),
        )
        .groupBy(["podcast_episode.id", "audio.public_url", "audio.length"])
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
