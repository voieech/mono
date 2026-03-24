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

    initialPageParam: undefined,

    getNextPageParam: (lastPage, _allPages) => lastPage?.at?.(-1)?.itemID,

    async queryFn(queryContext) {
      const res = await wrappedFetch(
        `/v1/user/consumed` +
          createUrlQueryParams({
            ...queryOptions,
            cursorItemID: queryContext.pageParam as string | undefined,
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
