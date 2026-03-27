import type { LikeableItemType, UserLikedItems } from "dto";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  queryKeyBuilder,
  wrappedFetch,
  getResError,
  createUrlQueryParams,
} from "@/api-client";

/**
 * Generic query to get all of the user's like items, and optionally filtered by
 * a given itemType.
 */
export function useUserLikeInfiniteQuery(queryOptions?: {
  itemType?: LikeableItemType;
  limit?: number;
}) {
  return useInfiniteQuery<UserLikedItems["items"]>({
    queryKey: queryKeyBuilder.fullPath("user.liked.$queryOptions", {
      queryOptions,
    }),

    // This is mostly used to show user their "like history", so every
    // time they navigate away and back, they could have potentially liked
    // another item, so this will always reload since we discarded the results
    // once no view is using this query to show this data
    gcTime: 0,

    initialPageParam: undefined,

    getNextPageParam: (lastPage, _allPages) => lastPage?.at?.(-1)?.id,

    async queryFn(queryContext) {
      const res = await wrappedFetch(
        `/v1/user/like` +
          createUrlQueryParams({
            ...queryOptions,
            cursorID: queryContext.pageParam as string | undefined,
          }),
      );

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to load user's liked items for: ${queryOptions}`,
          logError: true,
        });
      }

      return (await res.json()).items;
    },
  });
}
