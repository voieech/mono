import type { PodcastEpisode } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch, reactQueryClient } from "@/api-client";
import { apiBaseUrl } from "@/constants";

import { useAcceptLanguageHeader } from "../useAcceptLanguageHeader";

export function useFeaturedEpisodesQuery() {
  const acceptLanguageHeader = useAcceptLanguageHeader();

  return useQuery({
    queryKey: queryKeyBuilder.fullPathForDataInsertion(
      "podcast.featured.episodes",
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/podcast/featured/episodes?limit=20`,
        {
          headers: {
            ...acceptLanguageHeader,
          },
        },
      );

      if (!res.ok) {
        const defaultErrorMessage = "Failed to load featured episodes";
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      const episodes = (await res.json()) as Array<PodcastEpisode>;

      // Cache data so these dont need to be re queried again on navigate
      for (const episode of episodes) {
        reactQueryClient.setQueryData(
          queryKeyBuilder.fullPathForDataInsertion(
            "podcast.episode.vanityID.$vanityID",
            {
              vanityID: episode.vanity_id,
            },
          ),
          episode,
        );
        reactQueryClient.setQueryData(
          queryKeyBuilder.fullPathForDataInsertion(
            "podcast.episode.episodeID.$episodeID",
            {
              episodeID: episode.id,
            },
          ),
          episode,
        );
      }

      return episodes;
    },
  });
}
