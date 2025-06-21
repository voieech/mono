/**
 * Make certain fields in a object type required.
 */
export type MakeSomeFieldsRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
