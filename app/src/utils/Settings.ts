import TrackPlayer from "react-native-track-player";

import { capabilitiesWithJump, capabilitiesWithSkip } from "@/utils";

export interface BaseSetting<T> {
  /**
   * String literal value type used to differentiate between the different
   * possible setting types
   */
  type: string;
  name: string;
  description: string;
  /**
   * Default Value for this setting on first use
   */
  defaultValue: T;
  /**
   * If your setting needs to be synchronized with external systems on change,
   * and not just app internal UI changes.
   */
  onChange?: (newValue: T, oldValue: T) => unknown;
}

export interface DropdownSetting<T = string> extends BaseSetting<T> {
  type: "dropdown";
  options: Array<{
    value: T;
    name: string;
  }>;
}

export interface NumericStringSetting extends BaseSetting<string> {
  type: "numeric-string";
}

type SettingUnion = DropdownSetting<any> | NumericStringSetting;

export const externalMediaControls: DropdownSetting<
  "jump-time" | "skip-track"
> = {
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
  onChange(newValue) {
    const capabilities =
      newValue === "jump-time"
        ? capabilitiesWithJump
        : newValue === "skip-track"
        ? capabilitiesWithSkip
        : null;

    if (capabilities === null) {
      throw new Error(`Invalid Settings Value found: ${newValue}`);
    }

    TrackPlayer.updateOptions({ capabilities });
  },
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
