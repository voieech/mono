import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder } from "@/api-client";
import { getPodcastEpisodeNextReccomendations } from "@/api/direct-queries/getPodcastEpisodeNextReccomendations";

/**
 * Useful for showing reccomendations related to the current episode
 */
export function usePodcastEpisodeNextReccomendationsQuery(
  episodeID: string,
  limit: number = 10,
) {
  return useQuery({
    queryKey: queryKeyBuilder.fullPathForDataInsertion(
      "podcast.episode.reccomendations.episodeID.$episodeID.$limit",
      {
        episodeID,
        limit,
      },
    ),
    queryFn: () => getPodcastEpisodeNextReccomendations(episodeID, limit),
  });
}
