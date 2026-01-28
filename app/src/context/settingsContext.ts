import { createContext } from "react";

import { createUseContextHook } from "@/utils";
import { settings, type SettingNames, type SettingState } from "@/utils";

export const SettingContext = createContext<{
  /**
   * "Re-exporting" settings object so that users of this context can access the
   * main settings object from the context object without having to do an
   * additional import of the settings object
   */
  settings: typeof settings;

  /**
   * Get setting with the correct generic type returned
   */
  getSetting: <T extends SettingNames>(setting: T) => SettingState[T];

  /**
   * Update setting based on the allowed value type
   */
  updateSetting: <T extends SettingNames>(
    settingName: T,
    newValue: SettingState[T],
  ) => void;
}>(
  // @ts-expect-error
  null,
);

export const useSettingContext = createUseContextHook(
  SettingContext,
  "SettingContext",
);
