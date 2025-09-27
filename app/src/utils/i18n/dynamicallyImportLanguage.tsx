import type { Locale } from "./Locale";

/**
 * Dynamically import language .po file based on given Locale.
 */
export function dynamicallyImportLanguage(locale: Locale) {
  switch (locale) {
    case "zh":
    case "zh-CN":
    case "zh-TW":
      return import("../../locales/zh/messages.po").then((mod) => mod.messages);

    // "en" is the default locale for every other unsupported language.
    case "en":
    default:
      return import("../../locales/en/messages.po").then((mod) => mod.messages);
  }
}
