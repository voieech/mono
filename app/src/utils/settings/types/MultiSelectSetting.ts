import type { MessageDescriptor } from "@lingui/core";

import { BaseSetting } from "./BaseSetting";

export interface MultiSelectSetting<T extends Array<string> = Array<string>>
  extends BaseSetting<T> {
  type: "multi-select";
  options: Array<{
    value: T[number];
    name: MessageDescriptor | string;
  }>;
}
