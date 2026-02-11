/**
 * Type of the data stored on the `req` object by `authenticationMiddleware`
 * after checking for request user's authentication status, and finding the user
 * to be NOT authenticated.
 */
export type RequestUserAuthenticationDataForUnauthenticatedUser = {
  /**
   * Flag to determine if the user is authenticated. This will be set to
   * false if user failed authentication after the request passes through the
   * `authenticationMiddleware` successfully.
   */
  isAuthenticated: false;

  /**
   * What should the status code be when rejecting this request on the ground of
   * failed authentication?
   */
  httpStatusCode: 401 | 403;

  /**
   * What is the reason for failing authentication?
   */
  reason: string;
};
