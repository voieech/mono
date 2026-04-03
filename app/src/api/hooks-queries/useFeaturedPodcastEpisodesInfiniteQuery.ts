import type { PodcastEpisode } from "dto";

import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

import {
  useAcceptLanguageHeader,
  queryKeyBuilder,
  wrappedFetch,
  getResError,
  createUrlQueryParams,
} from "@/api-client";

/**
 * Generic query to get all the featured episodes
 */
export function useFeaturedPodcastEpisodesInfiniteQuery(queryOptions?: {
  limit?: number;
}) {
  const queryClient = useQueryClient();
  const acceptLanguageHeader = useAcceptLanguageHeader();

  return useInfiniteQuery<Array<PodcastEpisode>>({
    queryKey: queryKeyBuilder.fullPath(
      "podcast.featured.episodes.infinite.$queryOptions",
      {
        queryOptions,
      },
    ),

    initialPageParam: undefined,

    getNextPageParam: (lastPage, _allPages) => lastPage?.at?.(-1)?.created_at,

    async queryFn(queryContext) {
      const res = await wrappedFetch(
        `/v1/podcast/featured/episodes` +
          createUrlQueryParams({
            ...queryOptions,
            cursorID: queryContext.pageParam as string | undefined,
          }),
        {
          headers: {
            ...acceptLanguageHeader,
          },
        },
      );

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: "Failed to load featured episodes",
          logError: true,
        });
      }

      const podcastEpisodes = (await res.json()) as Array<PodcastEpisode>;

      // Cache data so these dont need to be re queried again on navigate
      for (const podcastEpisode of podcastEpisodes) {
        queryClient.setQueryData(
          queryKeyBuilder.fullPath("podcast.episode.episodeID.$episodeID", {
            episodeID: podcastEpisode.id,
          }),
          podcastEpisode,
        );
      }

      return podcastEpisodes;
    },
  });
}
