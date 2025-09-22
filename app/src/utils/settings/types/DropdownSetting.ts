import type { MessageDescriptor } from "@lingui/core";

import { BaseSetting } from "./BaseSetting";

export interface DropdownSetting<T = string> extends BaseSetting<T> {
  type: "dropdown";
  options: Array<{
    value: T;
    name: MessageDescriptor | string;
  }>;
}
