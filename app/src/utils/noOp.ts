/**
 * No Op function that allows you to return default value
 */
export function noOp<InputType extends Array<any>, OutputType extends any>(
  defaultOutput: OutputType,
) {
  return (..._: InputType) => {
    return defaultOutput;
  };
}
