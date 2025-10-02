import type { Episode } from "dto";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { apiBaseUrl } from "@/constants";

export function usePodcastEpisode(vanityID: string) {
  const router = useRouter();

  return useQuery({
    queryKey: ["episode", vanityID],
    async queryFn() {
      const res = await fetch(`${apiBaseUrl}/v1/podcast/episode/${vanityID}`);

      if (!res.ok) {
        if (res.status === 404) {
          router.replace("/+not-found");
        }

        const defaultErrorMessage = `Failed to load episode: ${vanityID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      return (await res.json()) as Episode;
    },
  });
}
