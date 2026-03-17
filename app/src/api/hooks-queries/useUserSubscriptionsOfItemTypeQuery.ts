import type { SubscribableItemType, UserSubscriptionsOfItemType } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch, getResError } from "@/api-client";

/**
 * Generic query to get all of the user's subscription for a given item type.
 */
export function useUserSubscriptionsOfItemTypeQuery(variables: {
  itemType: SubscribableItemType;
}) {
  return useQuery<UserSubscriptionsOfItemType>({
    queryKey: queryKeyBuilder.fullPath(
      "user.subscription.itemType.$itemType",
      variables,
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `/v1/user/subscription/${variables.itemType}`,
      );

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to load user's subscription status for: ${variables.itemType}`,
          logError: true,
        });
      }

      return await res.json();
    },
  });
}
