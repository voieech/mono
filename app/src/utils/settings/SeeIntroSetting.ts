import { LocalStorageWrapper } from "@/utils/LocalStorageWrapper";

class SeeIntroSetting extends LocalStorageWrapper<boolean> {
  _storageKey = "seeIntro";
  _defaultValue = true;
}

export const seeIntroSetting = new SeeIntroSetting();
