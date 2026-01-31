import type { PodcastEpisode } from "dto";
import type { Composer } from "vue-i18n";
import type { Router } from "vue-router";

import { useQuery } from "@tanstack/vue-query";

import { apiBaseUrl } from "@/api";
import { updateLangQueryParam } from "@/router";

export function usePodcastEpisode(
  options: {
    episodeID?: string;
    vanityID?: string;
  },
  optionals?: {
    /**
     * Only used to redirect to 404 page on 404 if provided
     */
    router?: Router;

    i18n?: Composer;
  },
) {
  const queryID = options.episodeID ?? options.vanityID;
  if (queryID === undefined) {
    throw new Error(`[${usePodcastEpisode.name}] No QueryID passed`);
  }

  const queryKey = [
    "podcast-episode",
    options.episodeID !== undefined ? "episodeID" : "vanityID",
    queryID,
  ];

  return useQuery({
    queryKey,
    async queryFn() {
      // @todo Query using query params instead of URL params since this should
      // be able to take both EpisodeID and VanityID
      const res = await fetch(`${apiBaseUrl}/v1/podcast/episode/${queryID}`);

      if (!res.ok) {
        if (res.status === 404) {
          optionals?.router?.replace({
            path: "/404",
          });
        }

        const defaultErrorMessage = `Failed to load episode: ${queryID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      const episode = (await res.json()) as PodcastEpisode;

      // @todo Only set this if the user didnt explicitly set the language control before
      if (optionals?.i18n !== undefined) {
        optionals.i18n.locale.value = episode.language;
        updateLangQueryParam(optionals.i18n.locale.value);
      }

      return episode;
    },
  });
}
