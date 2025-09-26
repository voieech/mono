import type { ParsedQs } from "qs";

/**
 * Takes in the value from `req.query["..."]` and returns the maybe string value
 * if any.
 */
export function convertUrlQueryParamToMaybeString(
  urlQueryParam: undefined | string | ParsedQs | Array<string | ParsedQs>,
) {
  if (Array.isArray(urlQueryParam)) {
    urlQueryParam = urlQueryParam.at(-1) ?? "";
  }
  if (typeof urlQueryParam === "string") {
    return urlQueryParam;
  }
  return undefined;
}
