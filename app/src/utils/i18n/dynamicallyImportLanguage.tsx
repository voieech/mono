/**
 * Switches a language code to a dynamically imported language .po file.
 */
export function dynamicallyImportLanguage(language: string) {
  switch (language) {
    case "zh":
    case "zh-CN":
    case "zh-TW":
    case "zh-Hans":
    case "zh-Hant":
      return import("../../locales/zh/messages.po").then((mod) => mod.messages);

    // "en" is the default locale for every other unsupported language.
    case "en":
    default:
      return import("../../locales/en/messages.po").then((mod) => mod.messages);
  }
}
