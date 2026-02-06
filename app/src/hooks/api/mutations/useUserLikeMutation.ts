import type { LikeableItemType, UserLikeStatus } from "dto";

import { useMutation } from "@tanstack/react-query";

import { wrappedFetch, reactQueryClient, queryKeyBuilder } from "@/api-client";
import { apiBaseUrl } from "@/constants";

/**
 * Generic user like mutation for a given item type and item ID.
 */
export function useUserLikeMutation() {
  return useMutation({
    async mutationFn(variables: {
      itemType: LikeableItemType;
      itemID: string;
      like: boolean;
    }) {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/user/like/${variables.itemType}/${variables.itemID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            like: variables.like,
          }),
        },
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to update user's like status for: ${variables.itemType}->${variables.itemID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        console.error(errorMessage);
      }

      const data = (await res.json()) as UserLikeStatus;

      reactQueryClient.setQueryData(
        queryKeyBuilder.fullPathForDataInsertion(
          "user.like.itemType.$itemType.itemID.$itemID",
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
