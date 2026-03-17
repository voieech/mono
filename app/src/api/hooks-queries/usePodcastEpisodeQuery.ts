import type { PodcastEpisode } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch, getResError } from "@/api-client";
import { NotFoundError } from "@/errors";

export function usePodcastEpisodeQuery(episodeID: string) {
  return useQuery({
    queryKey: queryKeyBuilder.fullPath("podcast.episode.episodeID.$episodeID", {
      episodeID,
    }),
    async queryFn() {
      const res = await wrappedFetch(`/v1/podcast/episode/${episodeID}`);

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to load podcast episode: ${episodeID}`,
          customError: res.status === 404 ? NotFoundError : Error,
          logError: true,
        });
      }

      return (await res.json()) as PodcastEpisode;
    },
  });
}
