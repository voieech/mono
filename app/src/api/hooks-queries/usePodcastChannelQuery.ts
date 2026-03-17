import type { PodcastChannel } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch, getResError } from "@/api-client";
import { NotFoundError } from "@/errors";

export function usePodcastChannelQuery(channelID: string) {
  return useQuery({
    queryKey: queryKeyBuilder.fullPath("podcast.channel.channelID.$channelID", {
      channelID,
    }),
    async queryFn() {
      const res = await wrappedFetch(`/v1/podcast/channel/${channelID}`);

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to load podcast channel: ${channelID}`,
          customError: res.status === 404 ? NotFoundError : Error,
          logError: true,
        });
      }

      return (await res.json()) as PodcastChannel;
    },
  });
}
