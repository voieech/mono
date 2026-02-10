import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Used when a validation failed. E.g. validating a given ID.
 *
 * In the above case, InvalidInputException also works, but that should only be
 * used for user / external inputs that fail validation. This is a broader
 * validation exception that can be used for user/external/internal sources.
 */
export class ValidationFailedException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Validation Failed Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.InternalServerError_500,
      jsendData: [
        ValidationFailedException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
