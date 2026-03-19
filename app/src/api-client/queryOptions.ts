import { createUrlQueryParams } from "@/api-client";

export type QueryOptions = {
  limit?: number;
};

export type OptionalQueryOptions = QueryOptions | undefined;

/**
 * Converts a given optional `QueryOptions` object into URL query params string
 * that can be directly appended to the API URL.
 *
 * @todo Move this into wrapped fetch?
 */
export const queryOptionsToUrlQueryParams = (
  queryOptions?: OptionalQueryOptions,
) => createUrlQueryParams(queryOptions);
