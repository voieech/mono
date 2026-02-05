import type { SubscribableItemType, UserSubscriptionStatus } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch } from "@/api-client";
import { apiBaseUrl } from "@/constants";

/**
 * Generic user subscription query for a given item type and item ID.
 */
export function useUserSubscriptionQuery(variables: {
  itemType: SubscribableItemType;
  itemID: string;
}) {
  return useQuery<UserSubscriptionStatus>({
    queryKey: queryKeyBuilder.fullPathForDataInsertion(
      "user.subscription.itemType.$itemType.itemID.$itemID",
      variables,
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/user/subscription/${variables.itemType}/${variables.itemID}`,
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to load user's subscription status for: ${variables.itemType}->${variables.itemID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        console.error(errorMessage);

        return {
          subscribe: undefined,
        };
      }

      return await res.json();
    },
  });
}
