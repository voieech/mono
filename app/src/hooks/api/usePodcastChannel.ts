import type { Channel } from "dto";

import { useQuery } from "@tanstack/react-query";

import { apiBaseUrl } from "@/constants";
import { NotFoundError } from "@/errors";

export function usePodcastChannel(channelID: string) {
  return useQuery({
    queryKey: ["podcast", "channel", channelID],
    async queryFn() {
      const res = await fetch(`${apiBaseUrl}/v1/podcast/channel/${channelID}`);

      if (!res.ok) {
        const defaultErrorMessage = `Failed to load channel: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);

        if (res.status === 404) {
          throw new NotFoundError(errorMessage);
        }

        throw new Error(errorMessage);
      }

      return (await res.json()) as Channel;
    },
  });
}
