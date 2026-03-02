import type { SubscribableItemType, UserSubscriptionsOfItemType } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch } from "@/api-client";

/**
 * Generic query to get all of the user's subscription for a given item type.
 */
export function useUserSubscriptionsOfItemTypeQuery(variables: {
  itemType: SubscribableItemType;
}) {
  return useQuery<UserSubscriptionsOfItemType>({
    queryKey: queryKeyBuilder.fullPathForDataInsertion(
      "user.subscription.itemType.$itemType",
      variables,
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `/v1/user/subscription/${variables.itemType}`,
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to load user's subscription status for: ${variables.itemType}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      return await res.json();
    },
  });
}
