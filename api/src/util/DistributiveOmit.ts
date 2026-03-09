/**
 * Standard `Omit` works by finding the keys like "id" | "createdAt" across the
 * entire union at once, which causes TypeScript to merge the result into one
 * generic object type.
 *
 * This solves the issue where applying `Omit` to a Union Type results in a
 * single "collapsed" object where the keys are merged, but the relationship
 * between type and data is lost (the discrimination is broken). To fix this,
 * you need to apply Omit to each member of the union individually. This is
 * called a Distributive Omit.
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;
