import { useMutation } from "@tanstack/react-query";

import { wrappedFetch } from "@/api-client";
import { apiBaseUrl } from "@/constants";

export function useSubmitContactFormMutation() {
  return useMutation({
    async mutationFn(contactObject: Record<string, any>) {
      const res = await wrappedFetch(`${apiBaseUrl}/v1/contact-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactObject),
      });

      if (!res.ok) {
        const defaultErrorMessage = `Failed to submit`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }
    },
  });
}
