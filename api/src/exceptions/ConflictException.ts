import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Used when an action is in conflict with existing data or another action.
 */
export class ConflictException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Conflict Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.Conflict_409,
      jsendData: [
        ConflictException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
