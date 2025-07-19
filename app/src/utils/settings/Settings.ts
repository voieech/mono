import type { SettingUnion } from "./types/SettingUnion";

import { defaultPlaybackSpeed } from "./defaultPlaybackSpeed";
import { externalMediaControls } from "./externalMediaControls";
import { rewindToStartOnSkipPrevious } from "./rewindToStartOnSkipPrevious";

/**
 * Settings objects holding all possible setting values
 */
export const settings = {
  externalMediaControls,
  defaultPlaybackSpeed,
  rewindToStartOnSkipPrevious,
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
  [K in SettingNames]: (typeof settings)[K] extends { type: "boolean-switch" }
    ? boolean
    : (typeof settings)[K] extends { type: "dropdown" }
      ? string
      : (typeof settings)[K] extends { type: "numeric-string" }
        ? string
        : never;
};

/**
 * Default setting state using values from the `settings` objects'
 * `defaultValue` properties.
 */
export const defaultSettingState = Object.entries(settings).reduce(
  (partialSettingState, settingEntry) => {
    const [settingName, setting] = settingEntry as [SettingNames, SettingUnion];
    partialSettingState[settingName] = setting.defaultValue;
    return partialSettingState;
  },
  {} as Partial<SettingState>,
) as SettingState;
