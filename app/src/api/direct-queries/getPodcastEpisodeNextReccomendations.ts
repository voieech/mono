import type { PodcastEpisode } from "dto";

import { wrappedFetch } from "@/api-client";

/**
 * Get a list of podcast episodes that are reccomended for given current episode
 */
export async function getPodcastEpisodeNextReccomendations(
  episodeID: string,
  limit: number = 10,
) {
  const res = await wrappedFetch(
    `/v1/podcast/reccomendations/next?current_episode_id=${episodeID}&limit=${limit}`,
  );

  if (!res.ok) {
    const defaultErrorMessage = `Failed to load episode reccomendations: ${episodeID}`;
    const errorMessage = await res
      .json()
      .then((data) => data.error ?? defaultErrorMessage)
      .catch(() => defaultErrorMessage);
    throw new Error(errorMessage);
  }

  return (await res.json()) as {
    reccomendations: Array<PodcastEpisode>;
  };
}
