import type { PodcastChannelUserSubscriptionStatus } from "dto";

import { useMutation } from "@tanstack/react-query";

import { wrappedFetch, reactQueryClient, queryKeyBuilder } from "@/api-client";
import { apiBaseUrl } from "@/constants";

/**
 * Update the current user's podcast channel subscription status
 */
export function usePodcastChannelUserSubscriptionStatusUpdateMutation() {
  return useMutation({
    async mutationFn(variables: { channelID: string; subscribe: boolean }) {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/podcast/channel/${variables.channelID}/user-subscription-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscribe: variables.subscribe,
          }),
        },
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to update user-subscription-status for channel: ${variables.channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        console.error(errorMessage);
      }

      const data = (await res.json()) as PodcastChannelUserSubscriptionStatus;

      reactQueryClient.setQueryData(
        queryKeyBuilder.fullPathForDataInsertion(
          "podcast.channel.channelID.$channelID.user-subscription-status",
          {
            channelID: variables.channelID,
          },
        ),
        data,
      );
    },
  });
}
