import type { Episode, Channel } from "dto";

import rss from "rss";

import { urlBuilders } from "../util/urlBuilders.js";

/**
 * Generate RSS XML string given a channel and its episodes.
 *
 * Note this is not idempotent since the generated XML will have a timestamp of
 * generation so this will return a different string even with the same inputs.
 *
 * Test using
 * - https://podba.se/validate/
 * - https://www.castfeedvalidator.com/
 */
export function generateRssXml(
  channel: Channel,
  episodes: Array<
    Omit<Episode, "externally_hosted_links"> & {
      audio_mime_type: string;
      audio_size: number;
    }
  >,
) {
  const feed = new rss({
    // The full URL associated with the podcast, typically a home page for a
    // podcast or a dedicated portion of a larger website.
    site_url: urlBuilders.rootDomain(),

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
    //   <a href="https://voieech.com">Voieech</a>
    // ]]>
    description: channel.description,

    feed_url: urlBuilders.apiDomain(1, `/podcast/channel/rss/${channel.id}`),

    image_url: channel.img_url,

    categories: [channel.category_primary, channel.category_secondary].filter(
      (category) => category !== null,
    ),

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
      //
      // When no category/subcategory, use empty object to make XML tag self
      // closing.
      ...[
        [channel.category_primary, channel.subcategory_primary],
        [channel.category_secondary, channel.subcategory_secondary],
      ].map(([category, subcategory]) =>
        category === null
          ? {}
          : {
              "itunes:category": [
                { _attr: { text: category } },
                subcategory === null
                  ? {}
                  : { "itunes:category": { _attr: { text: subcategory } } },
              ],
            },
      ),

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
      url: urlBuilders.rootDomain(
        `/podcast/episode/${episode.vanity_id}?lang=${episode.language}`,
      ),
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

  return feed.xml();
}
