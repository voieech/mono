export interface BaseSetting<T> {
  type: string;
  name: string;
  description: string;
  defaultValue: T;
  onChange?: (newValue: T, oldValue: T) => unknown;
}

export interface DropdownSetting extends BaseSetting<string> {
  type: "dropdown";
  options: Array<{
    value: string;
    name: string;
  }>;
}

export interface NumericStringSetting extends BaseSetting<string> {
  type: "numeric-string";
}

type SettingUnion = DropdownSetting | NumericStringSetting;

export const externalMediaControls: DropdownSetting = {
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
};

export const defaultPlaybackSpeed: NumericStringSetting = {
  type: "numeric-string",
  name: "",
  description: "",
  defaultValue: "1",
};

export const settings = {
  externalMediaControls,
  defaultPlaybackSpeed,
} as const satisfies Record<string, SettingUnion>;

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
