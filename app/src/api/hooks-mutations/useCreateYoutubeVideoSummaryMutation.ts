import { useMutation } from "@tanstack/react-query";

import { wrappedFetch } from "@/api-client";
import { apiBaseUrl } from "@/constants";

export function useCreateYoutubeVideoSummaryMutation() {
  return useMutation({
    async mutationFn(youtubeVideoID: string) {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/create/youtube-video-summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            youtubeVideoID,
          }),
        },
      );

      if (!res.ok) {
        const defaultErrorMessage = `Failed to create youtube video summary`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }
    },
  });
}
