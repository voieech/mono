import type { AudioTable } from "./AudioTable.js";
import type { BroadcastScriptChunkTable } from "./BroadcastScriptChunkTable.js";
import type { ContentGithubRepoTable } from "./ContentGithubRepoTable.js";
import type { ContentNewsArticleTable } from "./ContentNewsArticleTable.js";
import type { ContentTagTable } from "./ContentTagTable.js";
import type { ContentTweetTable } from "./ContentTweetTable.js";
import type { ContentYoutubeVideoTable } from "./ContentYoutubeVideoTable.js";
import type { PodcastChannelTable } from "./PodcastChannelTable.js";
import type { PodcastEpisodeContentSourceTable } from "./PodcastEpisodeContentSourceTable.js";
import type { PodcastEpisodeTable } from "./PodcastEpisodeTable.js";

export interface Database {
  audio: AudioTable;
  broadcast_script_chunk: BroadcastScriptChunkTable;
  content_github_repo: ContentGithubRepoTable;
  content_news_article: ContentNewsArticleTable;
  content_tag: ContentTagTable;
  content_tweet: ContentTweetTable;
  content_youtube_video: ContentYoutubeVideoTable;
  podcast_channel: PodcastChannelTable;
  podcast_episode_content_source: PodcastEpisodeContentSourceTable;
  podcast_episode: PodcastEpisodeTable;
}
