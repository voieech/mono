import { Capability } from "react-native-track-player";

/**
 * Media controls capabilities
 */
export type Capabilities = Array<Capability>;

export const baseCapabilities: Capabilities = [
  Capability.Play,
  Capability.Pause,
  Capability.Stop,
  Capability.SeekTo,
];

export const capabilitiesWithJump: Capabilities = [
  ...baseCapabilities,
  Capability.JumpForward,
  Capability.JumpBackward,
];

export const capabilitiesWithSkip: Capabilities = [
  ...baseCapabilities,
  Capability.SkipToNext,
  Capability.SkipToPrevious,
];
