import type { ConsumableItemType, UserConsumedStatus } from "dto";

import { useQueryClient } from "@tanstack/react-query";

import { wrappedFetch, queryKeyBuilder, getResError } from "@/api-client";

// How long before the same calls to this mutation will be fired again.
// Too high and it becomes somewhat inaccurate, too low and you are constantly
// hitting your API server
const rateLimitDurationInMs = 15000;

/**
 * Generic user consumed cached mutation for a given item type and item ID.
 *
 * This caches the results so that any calls with the same variable inputs will
 * be ignored for a "rate limit duration" time. This is fine since this is meant
 * for continuos upsert calls
 */
export function useUserConsumedCachedMutation() {
  const queryClient = useQueryClient();

  return (variables: {
    itemType: ConsumableItemType;
    itemID: string;
    consumed: boolean;
  }) => {
    return queryClient.fetchQuery({
      queryKey: queryKeyBuilder.fullPath(
        "user.consumed.itemType.$itemType.itemID.$itemID",
        {
          itemType: variables.itemType,
          itemID: variables.itemID,
        },
      ),
      staleTime: rateLimitDurationInMs,
      async queryFn() {
        const res = await wrappedFetch(
          `/v1/user/consumed/${variables.itemType}/${variables.itemID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              consumed: variables.consumed,
            }),
          },
        );

        if (!res.ok) {
          throw await getResError({
            res,
            defaultErrorMessage: `Failed to update user's consumed status for: ${variables.itemType}->${variables.itemID}`,
            logError: true,
          });
        }

        return (await res.json()) as UserConsumedStatus;
      },
    });
  };
}
