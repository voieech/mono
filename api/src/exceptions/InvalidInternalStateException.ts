import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Used when there is an invalid internal state that prevents the requested
 * action from being executed. E.g. a User object loaded from dal has no ID for
 * some reason.
 *
 * This converts to a HTTP 500 code since this is generally not a user
 * recoverable state.
 */
export class InvalidInternalStateException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Invalid Internal State Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.InternalServerError_500,
      jsendData: [
        InvalidInternalStateException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
