<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
import { apiBaseUrl } from "../../api";
import { PodcastEpisodeRoute } from "../../router";

const i18n = useI18n({ useScope: "global" });

const {
  isPending,
  isError,
  data: featuredEpisodes,
} = useQuery({
  queryKey: ["featured-episodes"],
  async queryFn() {
    const res = await fetch(
      `${apiBaseUrl}/v1/landing-page/featured-episodes/?lang=${i18n.locale.value}`,
    );

    if (!res.ok) {
      const defaultErrorMessage = "Failed to load featured episodes";
      const errorMessage = await res
        .json()
        .then((data) => data.error ?? defaultErrorMessage)
        .catch(() => defaultErrorMessage);
      throw new Error(errorMessage);
    }

    return res.json() as Promise<
      Array<{
        vanity_id: string;
        created_at: string;
        title: string;
        language: string;
        audio_length: number;
      }>
    >;
  },
  retry: false,
});
</script>

<template>
  <template v-if="!isPending && !isError && featuredEpisodes?.length !== 0">
    <div class="mx-auto max-w-6xl px-10 md:px-12 lg:px-16 xl:px-24">
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
                src="https://ichef.bbci.co.uk/images/ic/480x270/p0l50jyb.jpg.webp"
                alt="podcast episode image"
              />

              <div class="flex flex-col justify-between p-4 lg:p-6">
                <div class="pb-2">
                  <p class="line-clamp-3 text-xl">{{ episode.title }}</p>
                </div>
                <div>
                  <p class="text-sm text-zinc-600">
                    {{ episode.created_at.split("T")[0] }}
                  </p>
                  <!-- @todo Move this logic to somewhere standardised and move the $t call there -->
                  <p class="text-sm text-zinc-600">
                    {{ Math.trunc(episode.audio_length / 60) }}
                    {{ $t("SingleEpisode.mins") }}
                  </p>
                </div>
              </div>
            </div>
          </RouterLink>
        </template>
      </div>
    </div>
  </template>
</template>
