<script setup lang="ts">
import type { Episode } from "dto";

import { useQueryClient, useQuery } from "@tanstack/vue-query";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

import { apiBaseUrl } from "@/api";
import { PodcastEpisodeRoute } from "@/router";

const i18n = useI18n({ useScope: "global" });
const queryClient = useQueryClient();

const {
  isPending,
  isError,
  data: featuredEpisodes,
} = useQuery({
  queryKey: ["featured-episodes"],
  async queryFn() {
    const res = await fetch(
      `${apiBaseUrl}/v1/podcast/featured/episodes?limit=10&lang=${i18n.locale.value}`,
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
      queryClient.setQueryData(
        ["podcast-episode", "vanityID", episode.vanity_id],
        episode,
      );
    }

    return episodes;
  },
});
</script>

<template>
  <div
    v-if="!isPending && !isError && featuredEpisodes?.length !== 0"
    class="mx-auto max-w-6xl px-6 md:px-12 lg:px-16 xl:px-24"
  >
    <p class="pb-4 text-2xl text-zinc-800">Featured Episodes</p>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
      <template v-for="episode of featuredEpisodes" :key="episode.vanityID">
        <RouterLink
          :to="{
            name: PodcastEpisodeRoute.name,
            params: {
              vanityID: episode.vanity_id,
            },
            query: {
              lang: episode.language,
            },
          }"
        >
          <div
            class="flex h-full flex-row rounded-2xl border border-zinc-200 shadow-sm hover:shadow-2xl"
          >
            <img
              class="w-32 rounded-l-2xl object-cover sm:w-40"
              :src="episode.img_url"
              alt="podcast episode image"
            />

            <div class="flex flex-col justify-between p-4 lg:p-6">
              <div class="pb-2">
                <p class="line-clamp-3">{{ episode.title }}</p>
              </div>
              <div>
                <p class="text-xs text-zinc-600 sm:text-sm">
                  {{ episode.created_at.split("T")[0] }}
                </p>
                <!-- @todo Move this logic to somewhere standardised and move the $t call there -->
                <p class="text-xs text-zinc-600 sm:text-sm">
                  {{ Math.trunc(episode.audio_length / 60) }}
                  {{ $t("common.mins") }}
                </p>
              </div>
            </div>
          </div>
        </RouterLink>
      </template>
    </div>
  </div>
</template>
