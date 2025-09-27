import { i18n } from "@lingui/core";

import { dynamicallyImportLanguage } from "./dynamicallyImportLanguage";
import { getLocale } from "./getLocale";

/**
 * Based on the current device language, dynamically load the language's locale
 * messages.po file first before loading and activating lingui i18n.
 */
export async function dynamicallyLoadAndActivateLocale() {
  const locale = getLocale();
  const messages = await dynamicallyImportLanguage(locale);
  i18n.loadAndActivate({
    locale,
    messages,
  });
}
