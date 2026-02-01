import { QueryKeyBuilder } from "query-key-builder";

export const queryKeyBuilder = new QueryKeyBuilder<
  | "podcast.featured.channels"
  | "podcast.featured.episodes"
  | "podcast.channel.channelID.$channelID"
  | "podcast.channel.channelID.$channelID.episodes"
  | "podcast.channel.channelID.$channelID.user-subscription-status"
  | "podcast.episode.episodeID.$episodeID"
  | "podcast.episode.vanityID.$vanityID"
  | "podcast.episode.reccomendations.vanityID.$vanityID.$limit"
  | "create.youtube-video-summary.youtubeVideoID.$youtubeVideoID"
>();
