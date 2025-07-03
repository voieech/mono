import type { DropdownSetting } from "./DropdownSetting";
import type { NumericStringSetting } from "./NumericStringSetting";

export type SettingUnion = DropdownSetting<any> | NumericStringSetting;
