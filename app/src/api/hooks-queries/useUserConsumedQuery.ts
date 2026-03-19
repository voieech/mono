import type { ConsumableItemType, UserConsumedItems } from "dto";

import { useQuery } from "@tanstack/react-query";

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
export function useUserConsumedQuery(queryOptions?: {
  itemType?: ConsumableItemType;
}) {
  return useQuery<UserConsumedItems>({
    queryKey: queryKeyBuilder.fullPath("user.consumed.$queryOptions", {
      queryOptions,
    }),
    async queryFn() {
      const res = await wrappedFetch(
        `/v1/user/consumed` + createUrlQueryParams(queryOptions),
      );

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to load user's consumed items for: ${queryOptions}`,
          logError: true,
        });
      }

      return await res.json();
    },
  });
}
