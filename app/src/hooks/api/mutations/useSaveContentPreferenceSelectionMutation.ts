import { useMutation } from "@tanstack/react-query";

import { apiBaseUrl } from "@/constants";
import { NotFoundError } from "@/errors";
import { wrappedFetch } from "@/utils";

export function useSaveContentPreferenceSelectionMutation() {
  return useMutation({
    async mutationFn(userContentPreferenceTags: Array<string>) {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/user/settings/content-preference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userContentPreferenceTags,
          }),
        },
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to save user's content preferences`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);

        if (res.status === 404) {
          throw new NotFoundError(errorMessage);
        }

        throw new Error(errorMessage);
      }
    },
  });
}
