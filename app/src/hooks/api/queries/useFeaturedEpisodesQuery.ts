import type { Episode } from "dto";

import { useQuery } from "@tanstack/react-query";

import { apiBaseUrl } from "@/constants";
import { wrappedFetch, queryClient } from "@/utils";

import { useAcceptLanguageHeader } from "../useAcceptLanguageHeader";

export function useFeaturedEpisodesQuery() {
  const acceptLanguageHeader = useAcceptLanguageHeader();

  return useQuery({
    queryKey: ["podcast", "featured-episodes"],
    async queryFn() {
      const res = await wrappedFetch(
        `${apiBaseUrl}/v1/podcast/featured/episodes?limit=20`,
        {
          headers: {
            ...acceptLanguageHeader,
          },
        },
      );

      if (!res.ok) {
        const defaultErrorMessage = "Failed to load featured episodes";
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      const episodes = (await res.json()) as Array<Episode>;

      // Cache data so these dont need to be re queried again on navigate
      for (const episode of episodes) {
        queryClient.setQueryData(["episode", episode.vanity_id], episode);
      }

      return episodes;
    },
  });
}
