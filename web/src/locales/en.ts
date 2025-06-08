import type { Platform } from "../types/platform";

export default {
  common: {
    loading: "loading",
    SeasonNumber: "Season {seasonNumber}",
    EpisodeNumber: "Episode {episodeNumber}",
    mins: "mins",
    PodcastPlatforms: "Podcast Platforms",
  },

  PlatformName: {
    "voieech-audio-link": "Web Player",
    spotify: "Spotify",
    "apple-podcast": "Apple Podcast",
    youtube: "YouTube",
    audible: "Audible",
    "amazon-music": "Amazon Music",
    iheartradio: "iHeart Radio",
    overcast: "Overcast",
    pocketcasts: "pocketcasts",
    nprone: "NPR One",
    tunein: "TuneIn",
    kkbox: "KKBOX",
    firststory: "Firstory",
    soundon: "SoundOn",
    himalaya: "Himalaya",
  } satisfies Record<Platform, string>,

  PodcastEpisode: {
    loadingEpisode: "loading episode",
    ReadMore: "Read More",
    Hide: "Hide",

    WebPlayer: {
      name: "Voieech Web Player",
      preferred: "preferred",
      Control: "Control",
      SkipBackward: "Skip Backward",
      SkipForward: "Skip Forward",
      Reset: "Reset",
      Speed: "Speed",
      SpeedUp: "Speed Up",
      SlowDown: "Slow Down",
    },
  },
};
