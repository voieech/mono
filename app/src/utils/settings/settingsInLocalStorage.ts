import { LocalStorageWrapper } from "../LocalStorageWrapper";
import { SettingState, defaultSettingState } from "./Settings";

class SettingsInLocalStorage extends LocalStorageWrapper<
  Partial<SettingState>
> {
  _storageKey = "settings";
  _defaultValue = defaultSettingState;
}

/**
 * Wrapper around `localStorage` API for settings
 */
export const settingsInLocalStorage = new SettingsInLocalStorage();
