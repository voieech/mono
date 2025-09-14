import type { AudioTable } from "./AudioTable.js";
import type { BroadcastScriptChunkTable } from "./BroadcastScriptChunkTable.js";
import type { ContentTable } from "./ContentTable.js";
import type { ContentTagTable } from "./ContentTagTable.js";
import type { PodcastChannelTable } from "./PodcastChannelTable.js";
import type { PodcastEpisodeContentSourceTable } from "./PodcastEpisodeContentSourceTable.js";
import type { PodcastEpisodeExternallyHostedLinkTable } from "./PodcastEpisodeExternallyHostedLinkTable.js";
import type { PodcastEpisodeTable } from "./PodcastEpisodeTable.js";

export interface Database {
  audio: AudioTable;
  broadcast_script_chunk: BroadcastScriptChunkTable;
  content: ContentTable;
  content_tag: ContentTagTable;
  podcast_channel: PodcastChannelTable;
  podcast_episode_content_source: PodcastEpisodeContentSourceTable;
  podcast_episode_externally_hosted_link: PodcastEpisodeExternallyHostedLinkTable;
  podcast_episode: PodcastEpisodeTable;
}
