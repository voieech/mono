import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Used when an action contains invalid input. E.g. trying to withdraw a
 * negative dollar amount from an ATM.
 */
export class InvalidInputException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Invalid Input Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.BadRequest_400,
      jsendData: [
        InvalidInputException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
