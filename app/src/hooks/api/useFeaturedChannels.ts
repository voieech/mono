import type { Channel } from "dto";

import { useQuery } from "@tanstack/react-query";

import { apiBaseUrl } from "@/constants";
import { getAcceptLanguageHeader } from "@/utils";

export function useFeaturedChannels() {
  return useQuery({
    queryKey: ["podcast", "featured-channels"],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/podcast/featured/channel?count=2`,
        {
          headers: {
            ...getAcceptLanguageHeader(),
          },
        },
      );

      if (!res.ok) {
        const defaultErrorMessage = "Failed to load featured channels";
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      const channels = (await res.json()) as Array<Channel>;

      // Cache data so these dont need to be re queried again on navigate
      for (const _channel of channels) {
        // queryClient.setQueryData(["podcast-channel", channel.id], channel);
      }

      return channels;
    },
  });
}
