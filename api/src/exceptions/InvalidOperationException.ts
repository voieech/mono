import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Used when an action is not valid / possible. E.g. user tries to delete a team
 * account they claim to own, but in reality they do not own any team accounts.
 *
 * In the above case, technically ForbiddenException, NotFoundException,
 * InvalidOperationException, InvalidInternalStateException would also work, but
 * to allow users to be more specific, this exception makes cases like this more
 * clear on what exactly is the issue rather than masking behind some other type.
 */
export class InvalidOperationException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Invalid Operation Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.BadRequest_400,
      jsendData: [
        InvalidOperationException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
