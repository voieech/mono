import type { Channel } from "dto";

import { useQuery } from "@tanstack/react-query";

import { apiBaseUrl } from "@/constants";
import { wrappedFetch, queryClient } from "@/utils";

import { useAcceptLanguageHeader } from "../useAcceptLanguageHeader";

export function useFeaturedChannelsQuery() {
  const acceptLanguageHeader = useAcceptLanguageHeader();

  return useQuery({
    queryKey: ["podcast", "featured-channels"],
    async queryFn() {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/podcast/featured/channel?limit=20`,
        {
          headers: {
            ...acceptLanguageHeader,
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
      for (const channel of channels) {
        queryClient.setQueryData(["podcast", "channel", channel.id], channel);
      }

      return channels;
    },
  });
}
