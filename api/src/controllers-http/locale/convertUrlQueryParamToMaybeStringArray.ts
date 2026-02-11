import type { ParsedQs } from "qs";

export function convertUrlQueryParamToMaybeStringArray(
  urlQueryParam: undefined | string | ParsedQs | Array<string | ParsedQs>,
): undefined | Array<string> {
  if (urlQueryParam === undefined) {
    return undefined;
  }

  // If it's a single string, wrap it in an array
  if (typeof urlQueryParam === "string") {
    return [urlQueryParam];
  }

  // If it's an array, filter out "ParsedQs" and cast remaining to string
  if (Array.isArray(urlQueryParam)) {
    return urlQueryParam.filter(
      (item): item is string => typeof item === "string",
    );
  }

  // If it's a "ParsedQs" object, it's not directly convertible to Array<string>
  // so return undefined to indicate cannot convert
  return undefined;
}
