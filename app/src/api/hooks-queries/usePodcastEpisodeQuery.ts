import type { PodcastEpisode } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch } from "@/api-client";
import { apiBaseUrl } from "@/constants";
import { NotFoundError } from "@/errors";

export function usePodcastEpisodeQuery(episodeID: string) {
  return useQuery({
    queryKey: queryKeyBuilder.fullPathForDataInsertion(
      "podcast.episode.episodeID.$episodeID",
      {
        episodeID,
      },
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/podcast/episode/${episodeID}`,
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to load episode: ${episodeID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);

        if (res.status === 404) {
          throw new NotFoundError(errorMessage);
        }

        throw new Error(errorMessage);
      }

      return (await res.json()) as PodcastEpisode;
    },
  });
}
