import type { PodcastEpisode } from "dto";

import { useQueryClient, useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch } from "@/api-client";
import { NotFoundError } from "@/errors";

type QueryOptions = {
  limit?: number;
};

type OptionalQueryOptions = QueryOptions | undefined;

/**
 * Converts a given optional `QueryOptions` object into URL query params string
 * that can be directly appended to the API URL.
 *
 * @todo Move this into wrapped fetch?
 */
function queryOptionsToUrlQueryParams(queryOptions?: OptionalQueryOptions) {
  if (queryOptions === undefined) {
    return "";
  }
  return (
    "?" + new URLSearchParams(queryOptions as Record<string, string>).toString()
  );
}

export function usePodcastChannelEpisodesQuery(
  channelID: string,
  queryOptions?: OptionalQueryOptions,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeyBuilder.fullPath(
      "podcast.channel.channelID.$channelID.episodes.$queryOptions",
      {
        channelID,
        queryOptions,
      },
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `/v1/podcast/channel/${channelID}/episodes` +
          queryOptionsToUrlQueryParams(queryOptions),
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to load channel episodes: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);

        if (res.status === 404) {
          throw new NotFoundError(errorMessage);
        }

        throw new Error(errorMessage);
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
