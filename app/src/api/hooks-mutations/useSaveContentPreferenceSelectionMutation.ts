import { useMutation } from "@tanstack/react-query";

import { wrappedFetch, getResError } from "@/api-client";

export function useSaveContentPreferenceSelectionMutation() {
  return useMutation({
    async mutationFn(userContentPreferenceTags: Array<string>) {
      const res = await wrappedFetch(`/v1/user/settings/content-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userContentPreferenceTags,
        }),
      });

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to save user's content preferences`,
          logError: true,
        });
      }
    },
  });
}
