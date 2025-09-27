import { i18n } from "@lingui/core";

/**
 * Generate `"Accept-Language"` header using the currently set i18n locale value
 */
export function getAcceptLanguageHeader() {
  return {
    "Accept-Language": i18n.locale,
  };
}
