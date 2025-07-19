import { BaseSetting } from "./BaseSetting";

export interface BooleanSwitchSetting extends BaseSetting<boolean> {
  type: "boolean-switch";
}
