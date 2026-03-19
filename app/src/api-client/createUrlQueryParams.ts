/**
 * Creates appendable URL query params string from optional query params object.
 */
export function createUrlQueryParams(
  queryParams?: Record<string, string | number | boolean>,
) {
  if (queryParams === undefined) {
    return "";
  }

  const stringifiedQueryParamsObject = Object.entries(queryParams).reduce(
    (acc, [key, value]) => {
      acc[key] = value?.toString?.();
      return acc;
    },
    {} as Record<string, string>,
  );

  return "?" + new URLSearchParams(stringifiedQueryParamsObject).toString();
}
