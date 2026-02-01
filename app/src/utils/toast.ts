import type { MessageDescriptor } from "@lingui/core";

import Toast from "react-native-root-toast";

import { linguiMsgToString } from "./linguiMsgToString";

/**
 * Wrapper around toast with default options and support for i18n messages.
 */
export const toast = (msg: MessageDescriptor | string) =>
  Toast.show(linguiMsgToString(msg), {
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    opacity: 1,
  });
