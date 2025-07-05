import { createContext, useContext } from "react";

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
    setting: T,
    newValue: SettingState[T],
  ) => void;
}>({
  settings,
  getSetting: (_setting) => {
    throw new Error(
      "Cannot call SettingContext.getSetting outside of provider",
    );
  },
  updateSetting(_setting, _newValue) {
    throw new Error(
      "Cannot call SettingContext.updateSetting outside of provider",
    );
  },
});

/**
 * Access the whole `SettingContext` value.
 */
export const useSettingContext = () => useContext(SettingContext);
