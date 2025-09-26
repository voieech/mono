/**
 * Takes in the string from `req.headers["accept-language"]` and returns the
 * first specified language if any.
 */
export const convertAcceptLanguageHeaderToMaybeString = (
  header: string | undefined,
) =>
  header
    // Sample header "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
    // We only care about supporting the first one for now.
    ?.split(",")
    ?.at(0)

    // ignore q= parts
    ?.split(";")
    ?.at(0);
