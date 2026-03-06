import type { LikeableItemType, UserLikeStatus } from "dto";

import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, wrappedFetch } from "@/api-client";

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
        const defaultErrorMessage = `Failed to load user's like for: ${variables.itemType}->${variables.itemID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        console.error(errorMessage);

        return {
          like: false,
        };
      }

      return await res.json();
    },
  });
}
