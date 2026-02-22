/**
 * tApi (telegram API). This uses HTTP POST method and JSON body for sending
 * data by default, and parses the response as JSON.
 *
 * The data type of the API response after calling it
 * https://core.telegram.org/bots/api#making-requests
 */
export const tApi = (
  /**
   * Unique bot token for this bot
   */
  botToken: string,

  /**
   * Telegram API method found on https://core.telegram.org/bots/api#available-methods
   */
  tApiMethod: string,

  /**
   * Request body for the API that is already JSON stringified
   */
  body: string,
): Promise<{
  /**
   * If `true`, the request was successful and the result of the request can be
   * found in the `result` field.
   *
   * If `false`, the request was unsuccessful and the error is explained in the
   * `description`, and an Integer `error_code` field is also returned.
   */
  ok: boolean;

  /**
   * Optional result of the request if request was successful.
   */
  result?: unknown;

  /**
   * Response may have an optional human-readable description of the result. In
   * case of an unsuccessful request, the error is explained here.
   */
  description?: string;

  /**
   * Optional field only set when the request is unsuccessful. Subjected to
   * change in the future.
   */
  error_code?: number;

  /**
   * Some errors may also have an optional field for more information to
   * describe why a request was unsuccessful.
   */
  parameters?: {
    /**
     * Optional field to indicate that the group has been migrated to a
     * supergroup with the specified identifier. This number may have more than
     * 32 significant bits and some programming languages may have difficulty
     * / silent defects in interpreting it. But it has at most 52 significant
     * bits, so a signed 64-bit integer or double-precision float type are safe
     * for storing this identifier.
     */
    migrate_to_chat_id?: number;

    /**
     * Optional field to indicate the case of exceeding flood control, the
     * number of seconds left to wait before the request can be repeated.
     */
    retry_after?: number;
  };
}> =>
  fetch(`https://api.telegram.org/bot${botToken}/${tApiMethod}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then((res) => res.json());
