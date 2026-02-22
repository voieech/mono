export type PodcastEpisode = {
  id: string;
  created_at: string;
  season_number: number | null;
  episode_number: number | null;
  audio_public_url: string;
  audio_length: number;
  language: string;
  title: string;
  description: string;
  img_url: string;
  channel_id: string;
  channel_name: string;
  youtube_id: string | null;
};
