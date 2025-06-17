import { createI18n } from "vue-i18n";

import type { MessageSchema } from "./locales/MessageSchema";

import en from "./locales/en";
import zh from "./locales/zh";

export const i18n = createI18n<[MessageSchema], "en" | "zh">({
  legacy: false,

  // @todo Set this dynamically by order
  // 1. User's preference (based on what they choose / select during their last use)
  // 2. Dynamic detection based on user locale (only choose if it is one of the available options)
  // 3. Language setting in URL query param
  // 4. Fallback to en if none of the above is available
  locale: navigator.language?.split("-")?.[0] ?? "en",
  fallbackLocale: "en",

  fallbackWarn: false,
  silentFallbackWarn: false,
  silentTranslationWarn: true,
  missingWarn: false,

  messages: {
    en: en,
    zh: zh,
  },
});

export function setLocale(locale: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (i18n.global.locale as any).value = locale;
  document.querySelector("html")?.setAttribute("lang", locale);
}
