/**
 * Construct an `Error` object from the given failed `Response` or the default
 * error message, and return it for caller to throw it.
 */
export async function getResError(config: {
  /**
   * The returned response object
   */
  res: Response;

  /**
   * Pass in a default error message that will be used if there is no proper
   * error message sent back from the API call, e.g. in cases where the API
   * server is fully unreachable.
   */
  defaultErrorMessage?: string;

  /**
   * Allow constructing a custom error.
   * Expects a Class (constructor) that returns a subclass of `Error` class
   */
  customError?: new (...args: any) => Error;

  /**
   * Flag to control error logging
   */
  logError?: boolean;
}) {
  const ErrorClass = config.customError ?? Error;
  const defaultErrorMessage = config.defaultErrorMessage ?? "Response Error";

  const errorMessage = await config.res
    .json()
    // Assuming that for valid error responses, the shape would be
    // `extends { error: any }`
    .then((data) => data?.error ?? defaultErrorMessage)
    // For any error that happens while converting it to json, just use the
    // default error message instead of json parsing error
    .catch(() => defaultErrorMessage);

  if (config.logError) {
    console.error(errorMessage);
  }

  return new ErrorClass(errorMessage);
}
