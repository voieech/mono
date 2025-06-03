import type { Platform } from "./platform";

export type Episode = {
  id: string;
  createdAt: string;
  vanityID: string;
  episodeNumber: number | null;
  audioPublicUrl: string;
  audioLength: number;
  language: string;
  title: string;
  description: string;
  externallyHostedLinks: Array<{
    podcast_platform: Platform;
    url: string;
  }>;
};
