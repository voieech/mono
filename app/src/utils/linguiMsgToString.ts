import type { MessageDescriptor } from "@lingui/core";

import { i18n } from "@lingui/core";

/**
 * Support passing in strings too for cases where the input can be either a
 * plain string if no translations needed or a MessageDescriptor if needed.
 */
export const linguiMsgToString = (msg: MessageDescriptor | string) =>
  typeof msg === "string" ? msg : i18n._(msg);
