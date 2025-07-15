import type { SettingUnion } from "./types/SettingUnion";

import { localStorage } from "../localStorage";
import { defaultPlaybackSpeed } from "./defaultPlaybackSpeed";
import { externalMediaControls } from "./externalMediaControls";

/**
 * Settings objects holding all possible setting values
 */
export const settings = {
  externalMediaControls,
  defaultPlaybackSpeed,
} as const satisfies Record<string, SettingUnion>;

/**
 * Union type of all the setting name string literals
 */
export type SettingNames = keyof typeof settings;

/**
 * The type of the allowed setting state values, where the type is determined by
 * the 'type' string literal type field in each Settings interface.
 */
export type SettingState = {
  [K in SettingNames]: (typeof settings)[K] extends {
    type: "dropdown";
  }
    ? string
    : (typeof settings)[K] extends { type: "numeric-string" }
      ? string
      : never;
};

/**
 * Default setting state using values from the `settings` objects' `defaulValue`
 * properties.
 */
export const defaultSettingState = Object.entries(settings).reduce(
  (partialSettingState, settingEntry) => {
    const [settingName, setting] = settingEntry as [SettingNames, SettingUnion];
    partialSettingState[settingName] = setting.defaultValue;
    return partialSettingState;
  },
  {} as Partial<SettingState>,
) as SettingState;

/**
 * Wrapper around `localStorage` API for settings
 */
export const settingsInLocalStorage = {
  settingsStorageKey: "settings",

  /**
   * Returns settings data in localStorage. This will run a side effect of
   * writing default settings data to localStorage if no data is read the first
   * time.
   */
  async read() {
    const [err, data] = await localStorage.readData<SettingState>(
      this.settingsStorageKey,
    );

    if (err !== null) {
      // Only on first use, since settings data not in local storage yet, we
      // will write the default settings in
      if (err.name === localStorage.notFoundErrorName) {
        await this.resetToDefault();
        return defaultSettingState;
      }

      // If it is some other unknown error, re-throw it!
      throw err;
    }

    return data;
  },

  update(settings: SettingState) {
    return localStorage.writeData(this.settingsStorageKey, settings);
  },

  resetToDefault() {
    return this.update(defaultSettingState);
  },
} as const;
