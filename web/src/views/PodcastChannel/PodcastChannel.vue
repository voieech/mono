<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";

import LanguageSelector from "@/components/LanguageSelector.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { usePodcastChannel } from "@/composables/usePodcastChannel";
import { usePodcastChannelEpisodes } from "@/composables/usePodcastChannelEpisodes";
import {
  HomeRoute,
  PodcastEpisodeRoute,
  PodcastChannelEpisodesRoute,
} from "@/router";

import PlatformCard from "./PlatformCard.vue";

const router = useRouter();
const route = useRoute();
const channelID = route.params.channelID.toString();

const podcastChannelQuery = usePodcastChannel(channelID, { router });
const podcastChannelEpisodesQuery = usePodcastChannelEpisodes(channelID, {
  router,
});

useHead({
  title: computed(() =>
    podcastChannelQuery.data.value === undefined
      ? document.title
      : `voieech AI podcast - ${podcastChannelQuery.data.value.name}`,
  ),
});
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
      v-if="podcastChannelQuery.isPending.value"
      :message="$t('PodcastChannel.loading_channel')"
    />
    <div v-else-if="podcastChannelQuery.isError.value">
      Error: {{ podcastChannelQuery.error.value?.message }}
    </div>
    <template v-else-if="podcastChannelQuery.data.value !== undefined">
      <div
        class="flex flex-col gap-4 px-8 pt-4 pb-8 sm:flex-row sm:gap-8 sm:px-0"
      >
        <div class="sm:flex-1/2">
          <div class="flex flex-row items-center justify-center">
            <div class="max-w-80">
              <img
                class="rounded-2xl shadow-lg"
                :src="podcastChannelQuery.data.value.img_url"
                :alt="$t('PodcastChannel.ChannelImage')"
              />
            </div>
          </div>
        </div>

        <div>
          <p
            class="pb-4 text-center text-2xl font-medium text-zinc-800 sm:text-left"
          >
            {{ podcastChannelQuery.data.value.name }}
          </p>

          <p class="px-2 text-sm font-light text-zinc-600 sm:px-0">
            {{ podcastChannelQuery.data.value.description }}
          </p>
        </div>
      </div>

      <div
        v-if="
          !podcastChannelEpisodesQuery.isError.value &&
          podcastChannelEpisodesQuery.data.value?.length !== 0
        "
        class="pb-8"
      >
        <p class="pb-2 text-lg font-medium text-zinc-800">
          {{ $t("common.Featured") }}
        </p>
        <div class="flex flex-col gap-4">
          <template
            v-for="episode of podcastChannelEpisodesQuery.data.value"
            :key="episode.id"
          >
            <RouterLink
              :to="{
                name: PodcastEpisodeRoute.name,
                params: {
                  vanityID: episode.vanity_id,
                },
              }"
            >
              <div class="rounded-lg border border-zinc-200 p-4 shadow-lg">
                <p class="pb-2 text-xs text-zinc-600">
                  <span class="pr-2">{{
                    episode.created_at.split("T")[0]
                  }}</span>

                  <template v-if="episode.season_number !== null">
                    {{
                      $t("common.SeasonNumber", {
                        seasonNumber: episode.season_number,
                      })
                    }},
                  </template>
                  <template v-if="episode.episode_number !== null">
                    {{
                      $t("common.EpisodeNumber", {
                        episodeNumber: episode.episode_number,
                      })
                    }}
                  </template>
                </p>

                <div class="pb-2">
                  <p
                    class="line-clamp-3 text-sm leading-snug text-zinc-800 sm:line-clamp-2 sm:text-base"
                  >
                    {{ episode.title }}
                  </p>
                </div>

                <!-- @todo Add a play button -->

                <p class="text-xs font-extralight text-zinc-600">
                  {{ Math.trunc(episode.audio_length / 60) }}
                  {{ $t("common.mins") }}
                </p>
              </div>
            </RouterLink>
          </template>

          <RouterLink
            :to="{
              name: PodcastChannelEpisodesRoute.name,
            }"
            class="pt-2 text-center font-extralight text-zinc-600 underline decoration-zinc-200 underline-offset-4"
          >
            {{ $t("PodcastChannel.see_all_episodes") }}
          </RouterLink>
        </div>
      </div>

      <div>
        <p class="pb-2 pl-4 text-sm font-light text-zinc-400 italic">
          {{ $t("common.ExternalPodcastPlatforms") }}
        </p>

        <!-- @todo -->
        <PlatformCard
          class="pb-4"
          v-for="platform in [{ podcast_platform: 'spotify' as any, url: '' }]"
          :key="platform.podcast_platform"
          :platform="platform"
        />
      </div>
    </template>
  </div>
</template>
