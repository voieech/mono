import type { BooleanSwitchSetting } from "./BooleanSwitchSetting";
import type { DropdownSetting } from "./DropdownSetting";
import type { NumericStringSetting } from "./NumericStringSetting";

export type SettingUnion =
  | BooleanSwitchSetting
  | DropdownSetting<any>
  | NumericStringSetting;
