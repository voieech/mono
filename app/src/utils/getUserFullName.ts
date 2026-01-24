import { msg } from "@lingui/core/macro";

import { linguiMsgToString } from "./linguiMsgToString";

/**
 * Will return guest user name if name not available
 */
export function getUserFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
) {
  if (firstName != null && lastName != null) {
    return `${firstName} ${lastName}`;
  }

  if (firstName != null) {
    return firstName;
  }

  if (lastName != null) {
    return lastName;
  }

  return linguiMsgToString(msg`Guest User`);
}
