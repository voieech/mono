/**
 * Remove index signatures from an object.
 *
 * Converting something like
 * ```typescript
 * {
 *    name: string;
 *    [key: string]: any;
 * }
 * ```
 * into
 * ```typescript
 * {
 *    name: string;
 * }
 * ```
 */
export type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K]: T[K];
};
