import { HttpStatus } from "../http/HttpStatus.js";
import { HttpTransformerableException } from "./HttpTransformerableException.js";

/**
 * Throw this when something is not implemented yet.
 */
export class UnimplementedException extends HttpTransformerableException {
  constructor(
    optionalMessage: string = "Unimplemented Exception",
    public readonly details?: Array<string>,
  ) {
    super(optionalMessage);
  }

  transformToHttpResponseData() {
    return {
      httpStatusCode: HttpStatus.InternalServerError_500,
      jsendData: [
        UnimplementedException.name,
        this.message,
        ...(this.details ?? []),
      ],
    };
  }
}
