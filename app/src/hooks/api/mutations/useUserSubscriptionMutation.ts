import type { SubscribableItemType, UserSubscriptionStatus } from "dto";

import { useMutation } from "@tanstack/react-query";

import { wrappedFetch, reactQueryClient, queryKeyBuilder } from "@/api-client";
import { apiBaseUrl } from "@/constants";

/**
 * Generic user subscription mutation for a given item type and item ID.
 */
export function useUserSubscriptionMutation() {
  return useMutation({
    async mutationFn(variables: {
      itemType: SubscribableItemType;
      itemID: string;
      subscribe: boolean;
    }) {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/user/subscription/${variables.itemType}/${variables.itemID}`,
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
        const defaultErrorMessage = `Failed to update user's subscription status for: ${variables.itemType}->${variables.itemID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        console.error(errorMessage);
      }

      const data = (await res.json()) as UserSubscriptionStatus;

      reactQueryClient.setQueryData(
        queryKeyBuilder.fullPathForDataInsertion(
          "user.subscription.itemType.$itemType.itemID.$itemID",
          {
            itemType: variables.itemType,
            itemID: variables.itemID,
          },
        ),
        data,
      );
    },
  });
}
