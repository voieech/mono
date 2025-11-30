import type { BooleanSwitchSetting } from "./BooleanSwitchSetting";
import type { DropdownSetting } from "./DropdownSetting";
import type { MultiSelectSetting } from "./MultiSelectSetting";
import type { NumericStringSetting } from "./NumericStringSetting";
import type { StringSetting } from "./StringSetting";

export type SettingUnion =
  | BooleanSwitchSetting
  | DropdownSetting<any>
  | MultiSelectSetting<any>
  | NumericStringSetting
  | StringSetting;
