import type { PodcastChannel } from "dto";

import { useQueryClient, useQuery } from "@tanstack/react-query";

import {
  useAcceptLanguageHeader,
  queryKeyBuilder,
  wrappedFetch,
  getResError,
} from "@/api-client";

export function useFeaturedChannelsQuery() {
  const queryClient = useQueryClient();
  const acceptLanguageHeader = useAcceptLanguageHeader();

  return useQuery({
    queryKey: queryKeyBuilder.fullPath("podcast.featured.channels"),
    async queryFn() {
      const res = await wrappedFetch(`/v1/podcast/featured/channel?limit=20`, {
        headers: {
          ...acceptLanguageHeader,
        },
      });

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: "Failed to load featured channels",
          logError: true,
        });
      }

      const channels = (await res.json()) as Array<PodcastChannel>;

      // Cache data so these dont need to be re queried again on navigate
      for (const channel of channels) {
        queryClient.setQueryData(
          queryKeyBuilder.fullPath("podcast.channel.channelID.$channelID", {
            channelID: channel.id,
          }),
          channel,
        );
      }

      return channels;
    },
  });
}
