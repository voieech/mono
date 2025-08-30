import type { StringSetting } from "./types/StringSetting";

/**
 * The last time the user went through the onboarding flow in ISO datetime.
 * Defaults to empty string to indicate that the user hasnt seend the onboarding
 * flow before.
 */
export const lastOnboardingTime: StringSetting = {
  type: "string",
  name: "Show onboarding flow on next launch",
  description:
    "Set this to reset last seen onboarding time to re-run onboarding flow on next app launch for testing.",
  defaultValue: "",
};
