import { msg } from "@lingui/core/macro";
import TrackPlayer from "react-native-track-player";

import type { DropdownSetting } from "./types/DropdownSetting";

import {
  capabilitiesWithJump,
  capabilitiesWithSkip,
} from "../ReactNativeTrackPlayerCapabilitiesOptions";

export const externalMediaControls: DropdownSetting<
  "jump-time" | "skip-track"
> = {
  type: "dropdown",
  name: msg`External Audio controls`,
  description: msg`Choose the type of native media controls you want to see.`,
  options: [
    {
      value: "jump-time",
      name: msg`Show controls for jumping back and forth in 15 seconds intervals.`,
    },
    {
      value: "skip-track",
      name: msg`Show controls for skipping tracks to next/previous.`,
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
