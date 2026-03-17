import { useMutation } from "@tanstack/react-query";

import { wrappedFetch, getResError } from "@/api-client";

export function useCreateYoutubeVideoSummaryMutation() {
  return useMutation({
    async mutationFn(youtubeVideoID: string) {
      const res = await wrappedFetch(`/v1/create/youtube-video-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtubeVideoID,
        }),
      });

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to create youtube video summary`,
          logError: true,
        });
      }
    },
  });
}
