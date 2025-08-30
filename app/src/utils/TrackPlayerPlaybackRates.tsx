export const TrackPlayerPlaybackRates: Array<[string, number]> = [
  ["0.75", 0.75],
  ["1", 1],
  ["1.25", 1.25],
  ["1.5", 1.5],
  ["1.75", 1.75],
  ["2", 2],
];

/**
 * Map to convert rate string to number to avoid floating point comparisons.
 */
export const TrackPlayerPlaybackRateMap = new Map<string, number>(
  TrackPlayerPlaybackRates,
);
