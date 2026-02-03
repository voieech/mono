import type { Locale } from "./Locale";

import { messages as enMessages } from "../../locales/en/messages.po";

/**
 * Dynamically import language .po file based on given Locale.
 */
export function dynamicallyImportLanguage(locale: Locale) {
  switch (locale) {
    case "zh":
    case "zh-CN":
    case "zh-TW":
      return import("../../locales/zh/messages.po").then((mod) => mod.messages);

    case "en":
      return enMessages;

    // "en" is the default locale for every other unsupported language, but this
    // should not happen since we should only pass in supported locale, so this
    // will still log the error
    default:
      console.error(`Invalid locale '${locale}', falling back to en`);
      return enMessages;
  }
}

/**
 * Get fallback language messages
 */
export const fallbackLanguageLocaleAndMessages = {
  locale: "en",
  messages: enMessages,
};
