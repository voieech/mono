import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { getLocale } from "@/utils/i18n";

import type { MultiSelectSetting } from "./types/MultiSelectSetting";

type AllowedLocales = "en" | "zh" | "zh-CN" | "zh-TW";

export const contentLanguage: MultiSelectSetting<Array<AllowedLocales>> = {
  type: "multi-select",
  name: msg`Content Language`,
  description: msg`Select all the content languages you would like to see. You need to select at least one and you cannot remove the app's current language.`,
  options: [
    {
      value: "en",
      name: msg`English`,
    },
    {
      value: "zh",
      name: msg`Chinese (Simplified and Traditional)`,
    },
    {
      value: "zh-CN",
      name: msg`Chinese (Simplified / Mainland China)`,
    },
    {
      value: "zh-TW",
      name: msg`Chinese (Traditional / Taiwan)`,
    },
  ],
  // Defaults to the device / app language
  defaultValue: [getLocale()],
  // @todo Add support for selecting zh means selecting both zh-CHILD and vice versa for unselecting
  beforeChange(newValue, oldValue) {
    const set = new Set(oldValue);

    for (const value of newValue) {
      if (set.has(value)) {
        // At least 1 language required
        if (set.size > 1) {
          set.delete(value);
        }
      } else {
        set.add(value);
      }
    }

    // Get device current locale to remove it from set before setting it back as
    // the first locale in the list so that when making API requests this will
    // be treated with priority.
    const deviceLocale = i18n.locale as AllowedLocales;
    set.delete(deviceLocale);

    return [deviceLocale, ...set];
  },
  onChange() {
    // @todo Clear cache for all previous API calls
  },
};
