import type { Channel } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch, reactQueryClient } from "@/api-client";
import { apiBaseUrl } from "@/constants";

import { useAcceptLanguageHeader } from "../useAcceptLanguageHeader";

export function useFeaturedChannelsQuery() {
  const acceptLanguageHeader = useAcceptLanguageHeader();

  return useQuery({
    queryKey: queryKeyBuilder.fullPathForDataInsertion(
      "podcast.featured.channels",
    ),
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
        reactQueryClient.setQueryData(
          queryKeyBuilder.fullPathForDataInsertion(
            "podcast.channel.channelID.$channelID",
            {
              channelID: channel.id,
            },
          ),
          channel,
        );
      }

      return channels;
    },
  });
}
