import { pseudoRandomGenerator } from "./pseudoRandomGenerator.js";

/**
 * Generate a episode VanityID
 *
 * Using lowercase alphanumeric character set instead of the full
 * "A-Z, a-z, 0-9" so that it is easier for user's to type manually if needed.
 *
 * Since we are using "a-z, 0-9" character set, we have 36 possible values per
 * character, which translates to:
 * 5: 60,466,176 possible combinations
 * 6: 2,176,782,336 possible combinations
 * 7: 78,364,164,096 possible combinations
 *
 * For now to make it easier to see and for users to use, we will only use a 5
 * character long string as VanityID. As and when the number of episodes grow
 * alot / exponentially and we are running out of unique VanityIDs, we can
 * fairly easily just increase the length to 6 and beyond.
 */
export const episodeVanityIdGenerator = () =>
  pseudoRandomGenerator.lowercaseAlphanumericString(5);
