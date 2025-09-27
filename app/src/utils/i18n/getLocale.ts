import { getLocales } from "expo-localization";

import type { Locale } from "./Locale";

/**
 * Normalises locale to make sure it is a supported one, so that this works well
 * with our API with the same set of supported locales.
 */
export function getLocale(): Locale {
  const locale = getLocales()[0]?.languageTag ?? "en";

  if (
    locale === "zh" ||
    locale.startsWith("zh-CN") ||
    locale.startsWith("zh-Hans")
  ) {
    return "zh-CN";
  }

  if (locale.startsWith("zh-TW") || locale.startsWith("zh-Hant")) {
    return "zh-TW";
  }

  // "en" is the default locale for every other locale.
  return "en";
}
