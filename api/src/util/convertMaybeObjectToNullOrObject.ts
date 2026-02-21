export const convertMaybeObjectToNullOrObject = (
  maybeObject: null | undefined | Record<any, unknown>,
) =>
  maybeObject == null || Object.keys(maybeObject).length === 0
    ? null
    : maybeObject;
