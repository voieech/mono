import { useMutation } from "@tanstack/react-query";

import { wrappedFetch, getResError } from "@/api-client";

export function useSubmitContactFormMutation() {
  return useMutation({
    async mutationFn(contactObject: Record<string, any>) {
      const res = await wrappedFetch(`/v1/contact-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactObject),
      });

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to submit`,
          logError: true,
        });
      }
    },
  });
}
