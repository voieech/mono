import type { Episode } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch, reactQueryClient } from "@/api-client";
import { apiBaseUrl } from "@/constants";
import { NotFoundError } from "@/errors";

export function usePodcastChannelEpisodesQuery(channelID: string) {
  return useQuery({
    queryKey: queryKeyBuilder.fullPathForDataInsertion(
      "podcast.channel.episodes.$channelID",
      {
        channelID,
      },
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/podcast/channel/${channelID}/episodes`,
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

      const episodes = (await res.json()) as Array<Episode>;

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
