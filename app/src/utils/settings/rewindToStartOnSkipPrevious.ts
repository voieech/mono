import type { BooleanSwitchSetting } from "./types/BooleanSwitchSetting";

export const rewindToStartOnSkipPrevious: BooleanSwitchSetting = {
  type: "boolean-switch",
  name: "Rewind to track start when skipping to previous",
  description:
    "Skip to the start of the track when the 'skip to previous track' button is pressed after the track has played for 3 seconds, instead of skipping to the previous track immediately.",
  defaultValue: true,
};
