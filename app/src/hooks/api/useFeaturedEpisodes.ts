import type { Episode } from "dto";

import { useQuery } from "@tanstack/react-query";

import { apiBaseUrl } from "@/constants";
import { queryClient, getAcceptLanguageHeader } from "@/utils";

export function useFeaturedEpisodes() {
  return useQuery({
    queryKey: ["podcast", "featured-episodes"],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/podcast/featured/episodes?count=20`,
        {
          headers: {
            ...getAcceptLanguageHeader(),
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
