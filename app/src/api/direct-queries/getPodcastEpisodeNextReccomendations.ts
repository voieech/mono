import type { PodcastEpisode } from "dto";

import { wrappedFetch } from "@/api-client";
import { apiBaseUrl } from "@/constants";

/**
 * Get a list of podcast episodes that are reccomended for given current episode
 */
export async function getPodcastEpisodeNextReccomendations(
  vanityID: string,
  limit: number = 10,
) {
  const res = await wrappedFetch(
    `${apiBaseUrl}/v1/podcast/reccomendations/next?current_episode_vanity_id=${vanityID}&limit=${limit}`,
  );

  if (!res.ok) {
    const defaultErrorMessage = `Failed to load episode reccomendations: ${vanityID}`;
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
