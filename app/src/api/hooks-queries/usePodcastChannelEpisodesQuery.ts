import type { PodcastEpisode } from "dto";

import { useQueryClient, useQuery } from "@tanstack/react-query";

import {
  queryKeyBuilder,
  wrappedFetch,
  getResError,
  OptionalQueryOptions,
  queryOptionsToUrlQueryParams,
} from "@/api-client";
import { NotFoundError } from "@/errors";

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
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to load podcast channel episodes: ${channelID}`,
          customError: res.status === 404 ? NotFoundError : Error,
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
