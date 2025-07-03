import type { SettingUnion } from "./types/SettingUnion";

import { defaultPlaybackSpeed } from "./defaultPlaybackSpeed";
import { externalMediaControls } from "./externalMediaControls";

/**
 * Settings objects holding all possible setting values
 */
export const settings = {
  externalMediaControls,
  defaultPlaybackSpeed,
} as const satisfies Record<string, SettingUnion>;

export type SettingNames = keyof typeof settings;

/**
 * The type of the allowed setting state values, where the type is determined by
 * the 'type' string literal type field in each Settings interface.
 */
export type SettingState = {
  -readonly [K in SettingNames]: (typeof settings)[K] extends {
    type: "dropdown";
  }
    ? string
    : (typeof settings)[K] extends { type: "numeric-string" }
    ? string
    : never;
};
