export const PodcastPlatforms = [
  "voieech-audio-link",
  "spotify",
  "apple-podcast",
  "youtube",
  "audible",
  "amazon-music",
  "iheartradio",
  "overcast",
  "pocketcasts",
  "nprone",
  "tunein",
  "kkbox",
  "firststory",
  "soundon",
  "himalaya",
] as const;

/**
 * @todo Refactor out and build out the full strong type
 */
export type PodcastPlatform = (typeof PodcastPlatforms)[number];
