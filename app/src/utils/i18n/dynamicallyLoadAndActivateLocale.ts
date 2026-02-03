import { i18n } from "@lingui/core";

import {
  dynamicallyImportLanguage,
  fallbackLanguageLocaleAndMessages,
} from "./dynamicallyImportLanguage";
import { getLocale } from "./getLocale";

/**
 * Based on the current device language, dynamically load the language's locale
 * messages.po file first before loading and activating lingui i18n.
 */
export async function dynamicallyLoadAndActivateLocale() {
  // Always load the fallback first, so that if the msgstr is not available in
  // target language, it will fallback to this instead of the msgid, since the
  // msgid will be stripped and converted into a short hash string to save
  // bundle space in production
  i18n.load(
    fallbackLanguageLocaleAndMessages.locale,
    fallbackLanguageLocaleAndMessages.messages,
  );

  const locale = getLocale();
  const messages = await dynamicallyImportLanguage(locale);
  i18n.loadAndActivate({
    locale,
    messages,
  });
}
