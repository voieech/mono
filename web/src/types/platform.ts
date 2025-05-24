export const platforms = [
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

export type Platform = (typeof platforms)[number];
