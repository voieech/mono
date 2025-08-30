import { BaseSetting } from "./BaseSetting";

export interface StringSetting extends BaseSetting<string> {
  type: "string";
}
