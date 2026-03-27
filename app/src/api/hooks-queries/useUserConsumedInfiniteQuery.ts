import type { ConsumableItemType, UserConsumedItems } from "dto";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  queryKeyBuilder,
  wrappedFetch,
  getResError,
  createUrlQueryParams,
} from "@/api-client";

/**
 * Generic query to get all of the user's consumed items, and optionally
 * filtered by a given itemType.
 */
export function useUserConsumedInfiniteQuery(queryOptions?: {
  itemType?: ConsumableItemType;
  limit?: number;
}) {
  return useInfiniteQuery<UserConsumedItems["items"]>({
    queryKey: queryKeyBuilder.fullPath("user.consumed.$queryOptions", {
      queryOptions,
    }),

    // This is mostly used to show user their "consumption history", so every
    // time they navigate away and back, they could have potentially consumed
    // another item, so this will always reload since we discarded the results
    // once no view is using this query to show this data
    gcTime: 0,

    initialPageParam: undefined,

    getNextPageParam: (lastPage, _allPages) => lastPage?.at?.(-1)?.id,

    async queryFn(queryContext) {
      const res = await wrappedFetch(
        `/v1/user/consumed` +
          createUrlQueryParams({
            ...queryOptions,
            cursorID: queryContext.pageParam as string | undefined,
          }),
      );

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to load user's consumed items for: ${queryOptions}`,
          logError: true,
        });
      }

      return (await res.json()).items;
    },
  });
}
