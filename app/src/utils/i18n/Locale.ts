export const SUPPORTED_LOCALES = ["en", "zh", "zh-CN", "zh-TW"] as const;

/**
 * Union of all supported locale strings
 */
export type Locale = (typeof SUPPORTED_LOCALES)[number];
