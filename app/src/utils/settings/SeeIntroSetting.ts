import { LocalStorageWrapper } from "@/utils/LocalStorageWrapper";

export type IntroSetting = {
  lastSeenISO: string;
  showIntro: boolean;
};

// when reading key from storage in first instance default value will overwrite value in usestate
// we want to show intro on first run therefore default value is true

class SeeIntroSetting extends LocalStorageWrapper<IntroSetting> {
  _storageKey = "seeIntro";
  _defaultValue = { lastSeenISO: new Date().toISOString(), showIntro: true };
}

export const seeIntroSetting = new SeeIntroSetting();
