import type { PodcastEpisode } from "dto";

import { useQueryClient, useQuery } from "@tanstack/react-query";

import {
  useAcceptLanguageHeader,
  queryKeyBuilder,
  wrappedFetch,
  getResError,
} from "@/api-client";

export function useFeaturedEpisodesQuery() {
  const queryClient = useQueryClient();
  const acceptLanguageHeader = useAcceptLanguageHeader();

  return useQuery({
    queryKey: queryKeyBuilder.fullPath("podcast.featured.episodes"),
    async queryFn() {
      const res = await wrappedFetch(`/v1/podcast/featured/episodes?limit=20`, {
        headers: {
          ...acceptLanguageHeader,
        },
      });

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: "Failed to load featured episodes",
          logError: true,
        });
      }

      const episodes = (await res.json()) as Array<PodcastEpisode>;

      // Cache data so these dont need to be re queried again on navigate
      for (const episode of episodes) {
        queryClient.setQueryData(
          queryKeyBuilder.fullPath("podcast.episode.episodeID.$episodeID", {
            episodeID: episode.id,
          }),
          episode,
        );
      }

      return episodes;
    },
  });
}
