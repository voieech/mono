/**
 * Takes in the string from `req.headers["accept-language"]` and returns the
 * first specified language if any.
 */

export const convertAcceptLanguageHeaderToMaybeStringArray = (
  header: string | undefined,
) =>
  // Sample header "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
  header
    ?.split(",")
    // Remove all "q=" parts and only keep the first locale value part
    ?.map((h) => h.split(";").at(0))
    ?.filter((h) => h !== undefined);
