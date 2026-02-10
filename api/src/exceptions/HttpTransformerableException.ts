import type { HttpStatusCode, ValidJsendDatatype } from "../http/index.js";

import { Exception } from "./Exception.js";

export abstract class HttpTransformerableException extends Exception {
  /**
   * Call method to transform exception into HTTP response data, which includes
   * the HTTP response status code and a JSON serializable object following the
   * JSend specification for failures.
   */
  abstract transformToHttpResponseData(): {
    httpStatusCode: HttpStatusCode;
    jsendData: ValidJsendDatatype;
  };
}
