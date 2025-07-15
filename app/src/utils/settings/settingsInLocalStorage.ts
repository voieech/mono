import { localStorage } from "../localStorage";
import { SettingState, defaultSettingState } from "./Settings";

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
