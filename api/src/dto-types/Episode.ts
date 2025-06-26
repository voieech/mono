import type { PodcastPlatform } from "./PodcastPlatform.js";

export type Episode = {
  id: string;
  created_at: string;
  vanity_id: string;
  season_number: number | null;
  episode_number: number | null;
  audio_public_url: string;
  audio_length: number;
  language: string;
  title: string;
  description: string;
  img_url: string;
  channel_id: string;
  externally_hosted_links: Array<{
    podcast_platform: PodcastPlatform;
    url: string;
  }>;
};
