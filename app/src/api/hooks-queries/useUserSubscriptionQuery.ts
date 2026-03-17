import type { SubscribableItemType, UserSubscriptionStatus } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch, getResError } from "@/api-client";

/**
 * Generic user subscription query for a given item type and item ID.
 */
export function useUserSubscriptionQuery(variables: {
  itemType: SubscribableItemType;
  itemID: string;
}) {
  return useQuery<UserSubscriptionStatus>({
    queryKey: queryKeyBuilder.fullPath(
      "user.subscription.itemType.$itemType.itemID.$itemID",
      variables,
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `/v1/user/subscription/${variables.itemType}/${variables.itemID}`,
      );

      if (!res.ok) {
        await getResError({
          res,
          defaultErrorMessage: `Failed to load user's subscription status for: ${variables.itemType}->${variables.itemID}`,
          logError: true,
        });

        return {
          subscribe: false,
        };
      }

      return await res.json();
    },
  });
}
