import { createContext, useContext } from "react";

type DropdownSetting = {
  type: "dropdown";
  name: string;
  description: string;
  options: Array<{
    value: string;
    name: string;
  }>;
  defaultValue: string;
};

type NumberSetting = {
  type: "numeric-string";
  name: string;
  description: string;
  defaultValue: string;
};

export const settings = {
  externalMediaControls: {
    type: "dropdown",
    name: "",
    description: "",
    options: [
      {
        value: "jump-time",
        name: "Show controls for jumping back and forth in 15 seconds intervals",
      },
      {
        value: "skip-track",
        name: "Show controls for skipping tracks to next/previous",
      },
    ],
    defaultValue: "jump-time",
  },
  defaultPlaybackSpeed: {
    type: "numeric-string",
    name: "",
    description: "",
    defaultValue: "1",
  },
} as const satisfies Record<string, DropdownSetting | NumberSetting>;

export type SettingNames = keyof typeof settings;

export type SettingState = {
  -readonly [K in SettingNames]: (typeof settings)[K] extends {
    type: "dropdown";
  }
    ? string
    : (typeof settings)[K] extends { type: "numeric-string" }
    ? string
    : never;
};

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
    value: SettingState[T]
  ) => void;
}>({
  settings,
  getSetting: (_setting) => {
    throw new Error(
      "Cannot call SettingContext.getSetting outside of provider"
    );
  },
  updateSetting(_setting, _value) {
    throw new Error(
      "Cannot call SettingContext.updateSetting outside of provider"
    );
  },
});

/**
 * Access the whole `SettingContext` value.
 */
export const useSettingContext = () => useContext(SettingContext);
