import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Generic internal server exception when there is no other exception that suits
 * your needs.
 *
 * This converts to a HTTP 500 code since this is generally not a user
 * recoverable state.
 */
export class InternalServerException extends HttpTransformerableException {
  constructor(
    message: string,
    public readonly details?: Array<string>,
  ) {
    super(message);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.InternalServerError_500,
      jsendData: [
        InternalServerException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
