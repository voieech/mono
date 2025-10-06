import type { Episode } from "dto";

import { useQuery } from "@tanstack/react-query";

import { apiBaseUrl } from "@/constants";

/**
 * Useful for showing reccomendations related to the current episode
 */
export function usePodcastEpisodeNextReccomendations(
  vanityID: string,
  limit?: number,
) {
  return useQuery({
    queryKey: ["podcast", "episode", "reccomendations", vanityID],
    queryFn: () => getPodcastEpisodeNextReccomendations(vanityID, limit),
  });
}

/**
 * Get a list of podcast episodes that are reccomended for given current episode
 */
export async function getPodcastEpisodeNextReccomendations(
  vanityID: string,
  limit?: number,
) {
  const res = await fetch(
    `${apiBaseUrl}/v1/podcast/reccomendations/next?current_episode_vanity_id=${vanityID}&limit=${limit ?? 10}`,
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
    reccomendations: Array<Episode>;
  };
}
