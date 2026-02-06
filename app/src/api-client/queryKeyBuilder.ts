import { QueryKeyBuilder } from "query-key-builder";

export const queryKeyBuilder = new QueryKeyBuilder<
  | "podcast.featured.channels"
  | "podcast.featured.episodes"
  | "podcast.channel.channelID.$channelID"
  | "podcast.channel.channelID.$channelID.episodes"
  | "podcast.episode.episodeID.$episodeID"
  | "podcast.episode.vanityID.$vanityID"
  | "podcast.episode.reccomendations.vanityID.$vanityID.$limit"
  | "create.youtube-video-summary.youtubeVideoID.$youtubeVideoID"
  | "user.subscription.itemType.$itemType.itemID.$itemID"
  | "user.like.itemType.$itemType.itemID.$itemID"
>();
