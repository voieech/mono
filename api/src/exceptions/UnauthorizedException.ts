import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Used when a request is rejected because it lacks valid authentication
 * credentials, and that users can try again with the right credentials.
 */
export class UnauthorizedException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Unauthorized Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.Unauthorized_401,
      jsendData: [
        UnauthorizedException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
