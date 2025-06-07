import type { Platform } from "./platform";

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
  externallyHostedLinks: Array<{
    podcast_platform: Platform;
    url: string;
  }>;
};
