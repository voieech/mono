import { useQuery } from "@tanstack/vue-query";
import { apiBaseUrl } from "@/api";
import type { Router } from "vue-router";
import type { Episode } from "@/types/Episode";

export function usePodcastChannelEpisodes(
  channelID: string,
  optionals?: {
    /**
     * Only used to redirect to 404 page on 404 if provided
     */
    router?: Router;
  },
) {
  return useQuery({
    queryKey: ["podcast-channel-episodes", channelID],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/podcast/channel/episodes/${channelID}`,
      );

      if (!res.ok) {
        if (res.status === 404) {
          optionals?.router?.push({
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

      return (await res.json()) as Array<Episode>;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
