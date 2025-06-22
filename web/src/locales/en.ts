import type { PodcastPlatform } from "dto";

export default {
  common: {
    loading: "loading",
    SeasonNumber: "Season {seasonNumber}",
    EpisodeNumber: "Episode {episodeNumber}",
    mins: "mins",
    PodcastPlatforms: "Podcast Platforms",
    ExternalPodcastPlatforms: "External Podcast Platforms",
    Featured: "Featured",
    Episodes: "Episodes",
  },

  PlatformName: {
    "voieech-audio-link": "Web Player",
    spotify: "Spotify",
    apple: "Apple Podcast",
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
  } satisfies Record<PodcastPlatform, string>,

  PodcastChannel: {
    loading_channel: "loading channel",
    ChannelImage: "Channel Image",
    see_all_episodes: "see all episodes",
  },

  PodcastChannelEpisodes: {
    loading_episodes: "loading episodes",
    latest_first: "latest first",
  },

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
