import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Used when an action's actor is forbidden (not authorized) from performing it.
 */
export class ForbiddenException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Forbidden Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.Forbidden_403,
      jsendData: [
        ForbiddenException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
