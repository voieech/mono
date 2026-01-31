import type { PodcastEpisode } from "dto";
import type { Router } from "vue-router";

import { useQueryClient, useQuery } from "@tanstack/vue-query";

import { apiBaseUrl } from "@/api";

export function usePodcastChannelEpisodes(
  channelID: string,
  optionals?: {
    /**
     * Only used to redirect to 404 page on 404 if provided
     */
    router?: Router;
  },
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["podcast-channel-episodes", channelID],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/podcast/channel/${channelID}/episodes`,
      );

      if (!res.ok) {
        if (res.status === 404) {
          optionals?.router?.replace({
            path: "/404",
          });
        }

        const defaultErrorMessage = `Failed to load channel episodes: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      const episodes = (await res.json()) as Array<PodcastEpisode>;

      // Cache data so these dont need to be re queried again on navigate
      for (const episode of episodes) {
        queryClient.setQueryData(
          ["podcast-episode", "vanityID", episode.vanity_id],
          episode,
        );
      }

      return episodes;
    },
  });
}
