/**
 * Generate a pseudo random value with a given character set
 */
function pseudoRandomGeneratorFromCharacterSet(
  characterSet: string,
  length: number,
) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characterSet[Math.floor(Math.random() * characterSet.length)];
  }
  return result;
}

/**
 * ## DO NOT USE FOR SECURE USECASES
 */
export const pseudoRandomGenerator = {
  /**
   * For lowercase alphanumeric [a-z, 0-9] strings.
   */
  lowercaseAlphanumericString: (length: number) =>
    pseudoRandomGeneratorFromCharacterSet(
      "0123456789abcdefghijklmnopqrstuvwxyz",
      length,
    ),

  /**
   * For full alphanumeric [A-Z, a-z, 0-9] strings.
   */
  fullAlphanumericString: (length: number) =>
    pseudoRandomGeneratorFromCharacterSet(
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      length,
    ),
};
