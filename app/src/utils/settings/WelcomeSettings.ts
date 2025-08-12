import { LocalStorageWrapper } from "@/utils/LocalStorageWrapper";

export type WelcomeSettingState = {
  lastSeenISO?: string;
};

/**
 * This class is a wrapper over local storage for storing user last seen welcome page.
 */
class WelcomeSettings extends LocalStorageWrapper<
  Partial<WelcomeSettingState>
> {
  _storageKey = "hasSeenWelcome";
  _defaultValue = {};
}

export const welcomeSettings = new WelcomeSettings();
