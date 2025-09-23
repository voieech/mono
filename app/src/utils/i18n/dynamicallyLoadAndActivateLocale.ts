import { i18n } from "@lingui/core";

import { dynamicallyImportLanguage } from "./dynamicallyImportLanguage";
import { getDeviceLanguage } from "./getDeviceLanguage";

/**
 * Based on the current device language, dynamically load the language's locale
 * messages.po file first before loading and activating lingui i18n.
 */
export async function dynamicallyLoadAndActivateLocale() {
  const deviceLanguage = getDeviceLanguage();
  const messages = await dynamicallyImportLanguage(deviceLanguage);
  i18n.loadAndActivate({
    locale: deviceLanguage,
    messages,
  });
}
