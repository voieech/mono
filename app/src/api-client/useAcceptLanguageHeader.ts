import { useSettingContext } from "@/context";

/**
 * Generate the "accept-language" header using the content language setting.
 */
export function useAcceptLanguageHeader() {
  const settingContext = useSettingContext();
  const contentLanguageSetting = settingContext.getSetting("contentLanguage");
  return {
    // Not including rank/q= value and treating them all as equals
    "Accept-Language": contentLanguageSetting.join(","),
  };
}
