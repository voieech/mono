/**
 * Checks if a JWT's exp field is expired or will expire within a safety buffer.
 */
export function isJwtExpiredOrExpiringSoon(
  /**
   * The 'exp' claim from the decoded token (in seconds)
   */
  exp: number,
  /**
   * Buffer to check for near-expiration (default 60s).
   */
  bufferInSeconds: number = 60,
): boolean {
  const expirationDateInMs = new Date(exp * 1000).getTime();
  const currentTimeInMs = Date.now();
  return currentTimeInMs >= expirationDateInMs - bufferInSeconds * 1000;
}
