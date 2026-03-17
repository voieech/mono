import type { ConsumableItemType, UserConsumedStatus } from "dto";

import { useQueryClient, useMutation } from "@tanstack/react-query";

import { wrappedFetch, queryKeyBuilder, getResError } from "@/api-client";

/**
 * Generic user consumed mutation for a given item type and item ID.
 */
export function useUserConsumedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(variables: {
      itemType: ConsumableItemType;
      itemID: string;
      consumed: boolean;
    }) {
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
    onSuccess(data, variables) {
      queryClient.setQueryData(
        queryKeyBuilder.fullPath(
          "user.consumed.itemType.$itemType.itemID.$itemID",
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
