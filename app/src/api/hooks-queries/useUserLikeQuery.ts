import type { LikeableItemType, UserLikeStatus } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch, getResError } from "@/api-client";

/**
 * Generic user like query for a given item type and item ID.
 */
export function useUserLikeQuery(variables: {
  itemType: LikeableItemType;
  itemID: string;
}) {
  return useQuery<UserLikeStatus>({
    queryKey: queryKeyBuilder.fullPath(
      "user.like.itemType.$itemType.itemID.$itemID",
      variables,
    ),
    async queryFn() {
      const res = await wrappedFetch(
        `/v1/user/like/${variables.itemType}/${variables.itemID}`,
      );

      if (!res.ok) {
        await getResError({
          res,
          defaultErrorMessage: `Failed to load user's like for: ${variables.itemType}->${variables.itemID}`,
          logError: true,
        });

        return {
          like: false,
        };
      }

      return await res.json();
    },
  });
}
