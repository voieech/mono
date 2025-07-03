import { BaseSetting } from "./BaseSetting";

export interface NumericStringSetting extends BaseSetting<string> {
  type: "numeric-string";
}
