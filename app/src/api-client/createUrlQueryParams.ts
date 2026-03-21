/**
 * Creates appendable URL query params string from optional query params object.
 */
export function createUrlQueryParams(
  queryParams?: Record<string, undefined | string | number | boolean>,
) {
  if (queryParams === undefined) {
    return "";
  }

  const stringifiedQueryParamsObject = Object.entries(queryParams).reduce(
    (acc, [key, value]) => {
      // If it is undefined, skip it entirely
      if (value !== undefined) {
        acc[key] = value?.toString?.();
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return "?" + new URLSearchParams(stringifiedQueryParamsObject).toString();
}
