/**
 * To update this list as supported locales grow.
 *
 * @todo use a Trie/Set instead if it gets much larger (more than 30 elements)
 */
export const SUPPORTED_LOCALES = ["en", "zh", "zh-CN", "zh-TW"];

export function isLocaleSupported(locale: string) {
  return SUPPORTED_LOCALES.includes(locale);
}
