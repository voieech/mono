<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { useI18n } from "vue-i18n";
import { apiBaseUrl } from "@/api";
import PlatformCard from "./PlatformCard.vue";
import WebPlayer from "./WebPlayer.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { HomeRoute, updateLangQueryParam } from "@/router";
import type { Episode } from "@/types/Episode";

const i18n = useI18n({ useScope: "global" });
const router = useRouter();
const route = useRoute();
const vanityID = route.params.vanityID.toString();

const isDescriptionExpanded = ref(false);

const {
  isPending,
  isError,
  data: episode,
  error,
} = useQuery({
  queryKey: ["episode", vanityID],
  async queryFn() {
    const res = await fetch(`${apiBaseUrl}/v1/podcast/episode/${vanityID}`);

    if (!res.ok) {
      if (res.status === 404) {
        router.push({
          path: "/404",
        });
      }

      const defaultErrorMessage = `Failed to load episode: ${vanityID}`;
      const errorMessage = await res
        .json()
        .then((data) => data.error ?? defaultErrorMessage)
        .catch(() => defaultErrorMessage);
      throw new Error(errorMessage);
    }

    const episode = (await res.json()) as Episode;

    // @todo Use a package that supports SSR to set this?
    document.title = `voieech AI podcast - ${episode.title}`;

    i18n.locale.value = episode.language;
    updateLangQueryParam(i18n.locale.value);

    return episode;
  },
  retry: false,
});

// @todo Order platforms dynamically based on what user used to press? Like if last time they press spotify
</script>

<template>
  <div class="mx-auto max-w-screen-sm p-4 pb-32">
    <div class="flex flex-row items-center justify-between pb-4">
      <router-link :to="HomeRoute">
        <img class="h-12" src="../../assets/logo.png" alt="voieech logo" />
      </router-link>
      <LanguageSelector />
    </div>

    <LoadingSpinner
      v-if="isPending"
      :message="$t('SingleEpisode.loadingEpisode')"
    />
    <div v-else-if="isError">Error: {{ error?.message }}</div>
    <div v-else-if="episode !== undefined">
      <div class="pb-4">
        <p class="text-sm font-thin">
          <template v-if="episode.episode_number !== null">
            {{
              $t("SingleEpisode.episodeNumber", {
                episodeNumber: episode.episode_number,
              })
            }},
          </template>
          {{ episode.created_at.split("T")[0] }}
        </p>
        <p class="pb-2 text-2xl text-zinc-800">{{ episode.title }}</p>

        <p>
          {{ Math.trunc(episode.audio_length / 60) }}
          {{ $t("SingleEpisode.mins") }}
        </p>

        <div class="py-2"></div>

        <p
          class="text-sm leading-relaxed font-light"
          :class="{
            'line-clamp-3 text-zinc-800': !isDescriptionExpanded,
          }"
        >
          {{ episode.description }}
        </p>

        <div class="text-right">
          <button
            class="cursor-pointer text-sm text-blue-400 outline-none"
            :onclick="() => (isDescriptionExpanded = !isDescriptionExpanded)"
          >
            {{
              isDescriptionExpanded
                ? $t("SingleEpisode.Hide")
                : $t("SingleEpisode.ReadMore")
            }}
          </button>
        </div>
      </div>

      <div>
        <p class="pb-2 pl-4 text-sm font-light text-zinc-400 italic">
          {{ $t("SingleEpisode.PodcastPlatforms") }}
        </p>

        <WebPlayer class="pb-4" :url="episode.audio_public_url" />

        <PlatformCard
          class="pb-4"
          v-for="platform in episode.externallyHostedLinks"
          :key="platform.podcast_platform"
          :platform="platform"
        />
      </div>
    </div>

    <!-- @todo Add social icons here -->
  </div>
</template>
