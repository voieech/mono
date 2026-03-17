import type { SubscribableItemType, UserSubscriptionStatus } from "dto";

import { useQueryClient, useMutation } from "@tanstack/react-query";

import { wrappedFetch, queryKeyBuilder, getResError } from "@/api-client";

/**
 * Generic user subscription mutation for a given item type and item ID.
 */
export function useUserSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(variables: {
      itemType: SubscribableItemType;
      itemID: string;
      subscribe: boolean;
    }) {
      const res = await wrappedFetch(
        `/v1/user/subscription/${variables.itemType}/${variables.itemID}`,
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
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to update user's subscription status for: ${variables.itemType}->${variables.itemID}`,
          logError: true,
        });
      }

      return (await res.json()) as UserSubscriptionStatus;
    },
    onSuccess(data, variables) {
      queryClient.setQueryData(
        queryKeyBuilder.fullPath(
          "user.subscription.itemType.$itemType.itemID.$itemID",
          {
            itemType: variables.itemType,
            itemID: variables.itemID,
          },
        ),
        data,
      );

      queryClient.invalidateQueries({
        // Invalidate the "all subscriptions" query using exact, to prevent the
        // individual itemType.itemID subscription query to re-run again because
        // this API call already sets the value on return to prevent that extra
        // API call.
        exact: true,
        queryKey: queryKeyBuilder.partialPathForDataDeletion(
          "user.subscription.itemType.$itemType",
          {
            itemType: variables.itemType,
          },
        ),
      });
    },
  });
}
