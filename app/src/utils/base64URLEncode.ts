/**
 * Helper to convert base64 to base64url format (RFC 4648)
 */
export const base64URLEncode = (str: string) =>
  str.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
