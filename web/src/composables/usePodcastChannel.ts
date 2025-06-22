import type { Channel } from "dto";
import type { Router } from "vue-router";

import { useQuery } from "@tanstack/vue-query";

import { apiBaseUrl } from "@/api";

export function usePodcastChannel(
  channelID: string,
  optionals?: {
    /**
     * Only used to redirect to 404 page on 404 if provided
     */
    router?: Router;
  },
) {
  return useQuery({
    queryKey: ["podcast-channel", channelID],
    async queryFn() {
      const res = await fetch(`${apiBaseUrl}/v1/podcast/channel/${channelID}`);

      if (!res.ok) {
        if (res.status === 404) {
          optionals?.router?.replace({
            path: "/404",
          });
        }

        const defaultErrorMessage = `Failed to load channel: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      return (await res.json()) as Channel;
    },
  });
}
