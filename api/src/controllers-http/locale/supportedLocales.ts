/**
 * To update this list as supported locales grow.
 */
export const SUPPORTED_LOCALES = ["en", "zh", "zh-CN", "zh-TW"];

export function isLocaleSupported(locale: string) {
  return SUPPORTED_LOCALES.includes(locale);
}
