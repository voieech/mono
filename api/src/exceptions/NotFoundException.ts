import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Used when a piece of resource needed to perform the requested action is not
 * found.
 */
export class NotFoundException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Not Found Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.NotFound_404,
      jsendData: [
        NotFoundException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
