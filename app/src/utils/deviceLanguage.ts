import { getLocales } from "expo-localization";

/**
 * Defaults to `en` if unable to load device language
 */
export const deviceLanguage = getLocales()[0]?.languageCode ?? "en";
