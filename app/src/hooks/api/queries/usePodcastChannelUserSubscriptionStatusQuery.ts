import type { PodcastChannelUserSubscriptionStatus } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch } from "@/api-client";
import { apiBaseUrl } from "@/constants";

/**
 * Check whether the current user is subscribed to a podcast channel or not
 */
export function usePodcastChannelUserSubscriptionStatusQuery(
  channelID: string,
) {
  return useQuery<PodcastChannelUserSubscriptionStatus>({
    queryKey: queryKeyBuilder.fullPathForDataInsertion(
      "podcast.channel.channelID.$channelID.user-subscription-status",
      { channelID },
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/podcast/channel/${channelID}/user-subscription-status`,
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to load user-subscription-status for channel: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        console.error(errorMessage);

        return {
          subscribed: undefined,
        };
      }

      return await res.json();
    },
  });
}
