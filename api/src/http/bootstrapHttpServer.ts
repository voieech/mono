import type { PodcastPlatform } from "dto";

import cors from "cors";
import express from "express";
import * as kyselyPostgresHelpers from "kysely/helpers/postgres";
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

    .get("/v1/landing-page/featured-channels", async function (req, res) {
      const requestedLanguage = req.query["lang"]?.toString() ?? "en";

      // @todo
      // Check if language is a valid option first before even attempting to
      // querying DB, instead of relying on the DB query to check if language is
      // valid. Use $LanguageCode.makeStrongSafely, and fall back to en if none
      const isRequestedLanguageAvailable = true;

      const language = isRequestedLanguageAvailable ? requestedLanguage : "en";

      const featuredChannels = await apiDB
        .selectFrom("podcast_channel")
        .selectAll()
        .where("language", "like", `${language}%`)
        // @todo Ordery by popularity
        .limit(4)
        .execute();

      // @todo
      // Cache data so that not every landing page load causes a DB query. Cache
      // in upstash or something with a builtin TTL...

      res.status(200).json(featuredChannels);
    })

    .get("/v1/landing-page/featured-episodes", async function (req, res) {
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
        .where("podcast_episode.language", "like", `${language}%`)
        // @todo Ordery by popularity
        .orderBy("podcast_episode.created_at", "desc")
        .limit(4)
        .execute();

      // @todo
      // Cache featuredEpisodes so that not every landing page load causes a DB
      // query. Cache in upstash or something with a builtin TTL...

      res.status(200).json(featuredEpisodes);
    })

    .get("/v1/podcast/episode/:vanityID", async function (req, res) {
      const vanityID = req.params.vanityID;

      const episode = await apiDB
        .selectFrom("podcast_episode")
        .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
        .innerJoin(
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
        res.status(404).end(`Invalid Channel ID: ${channelID}`);
        return;
      }

      res.status(200).json(channel);
    })

    .get("/v1/podcast/channel/episodes/:channelID", async function (req, res) {
      const channelID = req.params.channelID;

      const channel = await apiDB
        .selectFrom("podcast_channel")
        .select("id")
        .where("podcast_channel.id", "=", channelID)
        .executeTakeFirst();

      if (channel === undefined) {
        res.status(404).end(`Invalid Channel ID: ${channelID}`);
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

      res.status(200).json(episodes);
    })

    .get("/v1/podcast/channel/rss/:channelID", async function (req, res) {
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
          "audio.mime_type as audio_mime_type",
          "audio.size as audio_size",
        ])
        .where("channel_id", "=", channelID)
        .orderBy("podcast_episode.created_at", "desc")
        .limit(20)
        .execute();

      const feed = new rss({
        // @todo Use URL builder
        site_url: `https://www.voieech.com`,

        // Apple podcast: only supports values from the ISO 639 list (two-letter
        // language codes, with some possible modifiers, such as "fr-ca").
        // https://www.loc.gov/standards/iso639-2/php/code_list.php
        language: channel.language,

        title: channel.name,

        // Apple podcast: Maximum allowed for this tag is 4000 bytes
        // To include links in your description or rich HTML, enclose all
        // portions of your XML that contain embedded HTML in a CDATA section to
        // prevent formatting issues, and to ensure proper link functionality.
        // For example:
        // <![CDATA[
        //   <a href="https://www.voieech.com">Voieech</a>
        // ]]>
        description: channel.description,

        // @todo Use URL builder
        feed_url: `https://api.voieech.com/v1/podcast/channel/rss/${channelID}`,

        image_url: channel.img_url,

        categories: [
          channel.category,
          ...(channel.subcategory !== null ? [channel.subcategory] : []),
        ],

        // @todo
        // ttl: 60 // in minutes

        // @todo voieech.com should be the same as the owner of the podcast
        copyright: `Copyright 2025-${
          $DateTime.now.asIsoDateTime().split("-")[0]
        } voieech.com`,

        // Override library defaults
        generator: "voieech.com",

        custom_namespaces: {
          podcast: "https://podcastindex.org/namespace/1.0",
          itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
        },

        // https://help.apple.com/itc/podcasts_connect/#/itcb54353390
        custom_elements: [
          /********************** Apple Podcast Required **********************/

          // The artwork for the show.
          // Depending on their device, subscribers see your podcast artwork in
          // varying sizes. Therefore, make sure your design is effective at
          // both its original size and at thumbnail size. You should include a
          // show title, brand, or source name as part of your podcast artwork.
          // Make sure the file type in the URL matches the actual file type of
          // the image file and ensure the server hosting your artwork allows
          // HTTP head requests including Last Modified.
          // Artwork must be a minimum size of 1400 x 1400 pixels and a maximum
          // size of 3000 x 3000 pixels, in JPEG or PNG format, 72 dpi, with
          // appropriate file extensions .jpg, .png, and in the RGB colorspace.
          // Confirm your art does not contain an Alpha Channel. These
          // requirements are different from the standard RSS image tag
          // specifications.
          { "itunes:image": { _attr: { href: channel.img_url } } },

          // See the list of categories/subcategories here
          // https://podcasters.apple.com/support/1691-apple-podcasts-categories
          //
          // Select the category that best reflects the content of your show.
          // If available, you can also define a subcategory.
          // Although you can specify more than one category and subcategory in
          // your RSS feed, Apple Podcasts only recognizes the first category
          // and subcategory.
          // When specifying categories and subcategories, be sure to properly
          // escape ampersands. For example:
          // Category with ampersand:
          //   <itunes:category text="Kids &amp; Family" />
          // Category with subcategory:
          //   <itunes:category text="Society &amp; Culture">
          //     <itunes:category text="Documentary" />
          //   </itunes:category>
          {
            "itunes:category": [
              { _attr: { text: channel.category } },

              // When no subcategory, set empty object so that the XML tag will
              // be self closing.
              channel.subcategory !== null
                ? {
                    "itunes:category": { _attr: { text: channel.subcategory } },
                  }
                : {},
            ],
          },

          // The podcast parental advisory information.
          { "itunes:explicit": false },

          /********************* Apple Podcast Recommended ********************/

          { "itunes:author": "voieech.com" },

          /********************* Apple Podcast Situational ********************/

          // The show title should be a clear concise name of your show
          { "itunes:title": channel.name },

          // Episodic (default). Specify episodic when episodes are intended to
          // be consumed without any specific order. Apple Podcasts will present
          // newest episodes first and display the publish date (required) of
          // each episode. If organized into seasons, the newest season will be
          // presented first - otherwise, episodes will be grouped by year
          // published, newest first.
          // For new subscribers, Apple Podcasts adds the newest, most recent
          // episode in their Library.
          { "itunes:type": "episodic" },
        ],
      });

      for (const episode of episodes) {
        feed.item({
          guid: episode.id,
          // @todo Use a URL builder
          url: `https://www.voieech.com/podcast/episode/${episode.vanity_id}?lang=${episode.language}`,
          date: episode.created_at,
          title: episode.title,

          // Description can be up to 10,000 characters, and rich text
          // formatting / some HTML (<p>, <ol>, <ul>, <li>, <a>) can be used if
          // wrapped in the <CDATA> tag.
          // Example:
          // <![CDATA[
          //   <a href="http://www.apple.com">Apple</a>
          // ]]>
          description: episode.description,

          enclosure: {
            url: episode.audio_public_url,
            type: episode.audio_mime_type,
            size: episode.audio_size,
          },

          custom_elements: [
            // @todo voieech.com should be the same as the owner of the podcast
            { "itunes:author": "voieech.com" },

            // Supports different format but using seconds for max compatibility
            { "itunes:duration": episode.audio_length },

            // The podcast parental advisory information.
            { "itunes:explicit": false },

            // Defaults to channel image if no episode specific image
            {
              "itunes:image": {
                _attr: { href: episode.img_url ?? channel.img_url },
              },
            },

            episode.season_number !== null && {
              "itunes:season": episode.season_number,
            },

            episode.episode_number !== null && {
              "itunes:episode": episode.episode_number,
            },
          ],
        });
      }

      res.status(200).end(feed.xml());
    })

    .listen(process.env["PORT"] ?? 3000);
}
